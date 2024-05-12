import { track, useEditor, exportToBlob, AssetRecordType } from "tldraw";
import { useMutation, useAction } from "convex/react";
import { api } from "../../convex/_generated/api";

import { getGroqChatCompletion } from "../tools/call-grok";

export type StoryState = {
  square: {
    x: number;
    y: number;
  };
  circle: {
    x: number;
    y: number;
  };
  narration: string;
};

export const AnimateButton = track(() => {
  const generateUploadUrl = useMutation(api.creatures.generateUploadUrl);
  const createCreature = useAction(api.creatures.createCreature);
  const story = [
    {
      square: {
        x: 50,
        y: 50,
      },
      circle: {
        x: 250,
        y: 250,
      },
      narration: "A square and a circle have appeared!",
    },
  ];

  const editor = useEditor();

  const updateStory = async (response: StoryState) => {
    const shapes = editor.getSelectedShapes();
    console.log({ shapes });
    shapes.forEach((shape) => {
      if (shape.type === "geo") {
        if (shape.props.geo === "ellipse") {
          console.log("updating ellipse");
          editor.updateShape({
            id: shape.id,
            type: "geo",
            x: response.circle.x,
            y: response.circle.y,
          });
        } else if (shape.props.geo === "rectangle") {
          editor.updateShape({
            id: shape.id,
            type: "geo",
            x: response.square.x,
            y: response.square.y,
          });
        }
      } else if (shape.type === "text") {
        editor.updateShape({
          id: shape.id,
          type: "text",
          props: {
            text: response.narration,
          },
        });
      }
    });
  };

  const createImageCreature = async () => {
    const url = await generateUploadUrl();
    const shapes = editor.getSelectedShapes();
    const shapeIds = shapes.map((shape) => shape.id);
    const blob = await exportToBlob({
      editor,
      ids: shapeIds,
      format: "png",
    });
    const result = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": blob!.type },
      body: blob,
    });
    const { storageId } = await result.json();
    console.log({ storageId });
    const creatureResult = await createCreature({ storageId, author: "anon" });
    console.log({ creatureResult });

    const assetId = AssetRecordType.createId();
    const imageWidth = 1024;
    const imageHeight = 1024;
    //[2]
    editor.createAssets([
      {
        id: assetId,
        type: "image",
        typeName: "asset",
        props: {
          name: "creature",
          src: creatureResult.creature.imgUrl,
          w: imageWidth,
          h: imageHeight,
          mimeType: "image/png",
          isAnimated: false,
        },
        meta: {},
      },
    ]);
    //[3]
    editor.createShape({
      type: "image",
      // Let's center the image in the editor
      x: (window.innerWidth - imageWidth) / 2,
      y: (window.innerHeight - imageHeight) / 2,
      props: {
        assetId,
        w: imageWidth,
        h: imageHeight,
      },
    });
  };

  const runAnimate = async () => {
    // const shapeIds = shapes.map((shape) => shape.id);
    // const blob = await exportToBlob({
    //   editor,
    //   ids: shapeIds,
    //   format: "png",
    // });
    // console.log({ blob });
    // })
    const completion = await getGroqChatCompletion(story);
    try {
      const cleaned = completion.replace(/\n/g, "");
      console.log({ cleaned });
      const json = JSON.parse(cleaned);
      console.log({ json });
      story.push(json);
      updateStory(json);
    } catch (error) {
      console.error({ error });
    }
  };

  return (
    <div style={{ position: "absolute", zIndex: 999 }}>
      <button onClick={runAnimate}>animate it!</button>
      <button onClick={createImageCreature}>make it a creature!</button>
    </div>
  );
});

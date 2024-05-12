import { track, useEditor } from "tldraw";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

export const AnimateButton = track(() => {
  const generateUploadUrl = useMutation(api.creatures.generateUploadUrl);
  const editor = useEditor();

  const runAnimate = () => {
    console.log({ editor });
    const shapes = editor.getSelectedShapes();
    console.log({ shapes });
  };

  console.log({ editor });

  return (
    <button style={{ position: "absolute", zIndex: 999 }} onClick={runAnimate}>
      animate it!
    </button>
  );
});

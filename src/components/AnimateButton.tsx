import { track, useEditor } from "tldraw";

export const AnimateButton = track(() => {
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

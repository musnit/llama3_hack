import { Tldraw, TLUiOverrides } from "tldraw";
import "./App.css";
import { AnimateButton } from "./components/AnimateButton";

function App() {
  const myOverrides: TLUiOverrides = {
    actions(_editor, actions) {
      // console.log({ actions });
      // You can delete actions, but remember to
      // also delete the menu items that reference them!
      // delete actions["insert-embed"];

      // Create a new action or replace an existing one
      // actions["my-new-action"] = {
      //   id: "my-new-action",
      //   label: "My new action",
      //   readonlyOk: true,
      //   kbd: "$u",
      //   onSelect(source: any) {
      //     // Whatever you want to happen when the action is run
      //     window.alert("My new action just happened!");
      //   },
      // };
      return actions;
    },
    tools(editor, tools) {
      // Create a tool item in the ui's context.
      tools.card = {
        id: "card",
        icon: "color",
        label: "tools.card",
        kbd: "c",
        onSelect: () => {
          // Whatever you want to happen when the tool is selected
          editor.setCurrentTool("card");
        },
      };
      // console.log({ tools });
      return tools;
    },
  };

  return (
    <div style={{ position: "fixed", inset: 0 }}>
      <Tldraw overrides={myOverrides}>
        <AnimateButton />
      </Tldraw>
    </div>
  );
}

export default App;

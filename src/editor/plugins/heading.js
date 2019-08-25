import React from "react";
import { isKeyHotkey } from "is-hotkey";

const isH1 = isKeyHotkey("mod+1");
const isH2 = isKeyHotkey("mod+2");
const isP = isKeyHotkey("mod+p");

export function headingPlugin() {
  return {
    onKeyDown(evt, editor, next) {
      if (isH1(evt)) {
        evt.preventDefault();
        editor.title('h1');
      } else if (isH2(evt)) {
        evt.preventDefault();
        editor.title('h2');
      } else if (isP(evt)) {
        evt.preventDefault();
        editor.title('paragraph');
      } else {
        next();
      }
    },
    commands: {
      title(editor, type) {
        let currentBlockType = editor.getCurrentBlockType();
        if (currentBlockType === type) {
          editor
            .focus()
            .setBlocks('paragraph');
        } else {
          editor
            .focus()
            .setBlocks(type);
        }
      }
    },
    renderBlock(props, editor, next) {
      let { node, children, attributes } = props;

      switch (node.type) {
        case "h1":
          return <h1 {...attributes}>{children}</h1>
        case "h2":
          return <h2 {...attributes}>{children}</h2>
        default:
          return next();
      }
    }
  };
}

function Heading({
  editor,
  type
}) {
  const onClick = () => {
    editor.title(type);
  }

  const isActive = editor ? editor.getCurrentBlockType() === type : false;
  let style = isActive ? { color: "red" } : {};

  return <button style={style} onClick={onClick}>{type}</button>
}

export function HeadingButton(props) {
  return (
    <React.Fragment>
      <Heading type="h1" {...props} />
      <Heading type="h2" {...props} />
    </React.Fragment>
  )
}

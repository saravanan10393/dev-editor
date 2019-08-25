import React from "react";
import { isKeyHotkey } from "is-hotkey";

const isBoldHotkey = isKeyHotkey("mod+b");
const isItalicHotkey = isKeyHotkey("mod+i");
const isUnderlinedHotkey = isKeyHotkey("mod+u");
const isStrikeThroughHotkey = isKeyHotkey("mod+l");

export function formatPlugin() {
  return {
    onKeyDown: (evt, editor, next) => {
      if (isBoldHotkey(evt)) {
        console.log("key down event is calling", evt.key);
        editor.bold();
      } else if (isItalicHotkey(evt)) {
        editor.italic();
      } else if (isUnderlinedHotkey(evt)) {
        editor.underline();
      } else if (isStrikeThroughHotkey(evt)) {
        evt.preventDefault();
        editor.strikeThrough();
      } else {
        return next();
      }
    },
    onSelect(evt, editor, next) {
      console.log("dom selection called");
      next();
    },
    commands: {
      bold: editor => {
        editor.toggleMark("bold");
      },
      italic: editor => {
        editor.toggleMark("italic");
      },
      underline: editor => {
        editor.toggleMark("underline");
      },
      strikeThrough: editor => {
        editor.toggleMark("strikeThrough");
      },
      color: (editor, color) => {
        editor.replaceMark(
          { type: "color" },
          {
            type: "color",
            data: {
              color
            }
          }
        );
      }
    },
    renderMark(props, editor, next) {
      let { mark, children, attributes } = props;
      switch (mark.type) {
        case "bold":
          return <b {...attributes}>{children}</b>;
        case "italic":
          return <i {...attributes}>{children}</i>;
        case "underline":
          return <u {...attributes}>{children}</u>;
        case "strikeThrough":
          return <strike {...attributes}>{children}</strike>;
        default:
          return next();
      }
    }
  };
}


export function BoldButton({
  editor
}) {
  const onClick = () => {
    editor.bold();
  }

  const isActive = editor ? editor.isMarkActive('bold') : false;
  let style = isActive ? { color: "red" } : {};

  return <button style={style} onClick={onClick}>B</button>
}

export function ItalicButton({
  editor
}) {
  const onClick = () => {
    editor.italic();
  }
  const isActive = editor ? editor.isMarkActive('italic') : false;
  let style = isActive ? { color: "red" } : {};

  return <button style={style} onClick={onClick}>I</button>
}

export function UnderlineButton({
  editor
}) {
  const onClick = () => {
    editor.underline();
  }
  const isActive = editor ? editor.isMarkActive('underline') : false;
  let style = isActive ? { color: "red" } : {};

  return <button style={style} onClick={onClick}>U</button>
}

export function StrikeThroughButton({
  editor
}) {
  const onClick = () => {
    editor.strikeThrough();
  }
  const isActive = editor ? editor.isMarkActive('strikeThrough') : false;
  let style = isActive ? { color: "red" } : {};

  return <button style={style} onClick={onClick}>S</button>
}
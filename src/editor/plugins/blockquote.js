import React from "react";
import { isKeyHotkey } from "is-hotkey";

const isQuoteKey = isKeyHotkey("mod+'");

export function blockquotePlugin() {
  return {
    onKeyDown: (evt, editor, next) => {
      if (
        evt.key === 'Enter' &&
        evt.shiftKey === false &&
        editor.getCurrentBlockType() === 'blockquote') {
        editor.insertBlock('paragraph');
      } else if (isQuoteKey(evt)) {
        evt.preventDefault();
        editor
          .focus()
          .blockquote();
      } else {
        return next();
      }
    },
    commands: {
      blockquote: editor => {
        if (editor.getCurrentBlockType() === 'blockquote') {
          editor.setBlocks('paragraph');
        } else {
          editor.setBlocks('blockquote');
        }
      }
    },
    renderBlock(props, editor, next) {
      let { node, children, attributes } = props;
      let style = {
        "border-left": "0.3rem solid #dfe2e5",
        "color": "#6a737d",
        "padding": "0.5rem 1rem"
      }
      return node.type === 'blockquote' ?
        <blockquote {...attributes} style={style}>{children}</blockquote> :
        next();
    }
  };
}

export function BlockquoteButton({
  editor
}) {
  const onClick = () => {
    editor.blockquote();
  }

  const isActive = editor ? editor.getCurrentBlockType() === 'blockquote' : false;
  let style = isActive ? { color: "red" } : {};

  return <button style={style} onClick={onClick}>"</button>
}

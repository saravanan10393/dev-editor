import React from 'react';
import { isKeyHotkey } from "is-hotkey";

const isCodeKey = isKeyHotkey("mod+shift+c");

export function codePlugin() {
  return {
    onKeyDown: (evt, editor, next) => {
      if (
        evt.key === 'Enter' &&
        evt.metaKey === false &&
        editor.isBlockOfType('code')) {
        editor.insertText('\n');
      } else if(
        evt.key === 'Enter' &&
        evt.metaKey === true &&
        editor.isBlockOfType('code')) {
          editor
            .insertBlock('paragraph')
            .focus();
      } else if (isCodeKey(evt)) {
        evt.preventDefault();
        editor
          .focus()
          .code();
      } else {
        return next();
      }
    },
    commands: {
      code(editor, args) {
        if(editor.isBlockOfType('code')) {
          editor.setBlocks({
            type: 'paragraph',
            data: {}
          }).focus();
        }else {
          editor
            .insertBlock("code")
            .focus();
        }
      }
    },
    renderBlock({ node, attributes, children }, editor, next) {
      if(node.type === 'code') {
        let style = {
          fontFamily: "monospace",
          fontSize: "12px",
          padding: "0.5rem 1rem",
          background: "#ddd",
          display: "block"
        };
        return <code style={style} {...attributes}>{children}</code>
      }
      return next();
    }
  }
}
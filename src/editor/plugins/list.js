import React from "react";
import { isKeyHotkey } from "is-hotkey";

const isCmdEnter = isKeyHotkey("mod+Enter");

const isListNode = (node) => ['unOrderedList', 'orderedList']
export function listPlugin() {
  return {
    schema: {
      blocks: {
        orderedList: {
          nodes: [{
            type: "list-item"
          }]
        },
        unOrderedList: {
          nodes: [{
            type: "list-item"
          }]
        }
      },
    },
    onKeyDown: (evt, editor, next) => {
      if(
        !isCmdEnter(evt) &&
        evt.key === 'Enter' &&
        editor.getCurrentBlockType() === 'list-item') {
        return editor
          .insertBlock('list-item');
      } else if (
        isCmdEnter(evt) &&
        editor.getCurrentBlockType() === 'list-item') {
        return editor
          .insertBlock('paragraph')
          .unwrapBlock("unOrderedList")
          .unwrapBlock("orderedList");
      }else if(
        evt.key === 'Backspace' &&
        editor.value.startBlock.type === 'list-item' &&
        editor.value.document.getClosest(editor.value.startBlock.key, isListNode).text.trim().length === 0
      ) {
        editor
        .setBlocks('paragraph')
        .unwrapBlock("unOrderedList")
        .unwrapBlock("orderedList");
        return next();
      }else {
        return next();
      }
    },
    commands: {
      insertList: (editor, listType) => {
        let isList = editor.isBlockOfType('list-item');
        const isSameListType = editor.value.blocks.some(block => {
          return !!editor.value.document.getClosest(block.key, parent => parent.type === listType)
        });
        if (isList && isSameListType) {
          editor.setBlocks('paragraph')
            .unwrapBlock(listType);
        } else if(isList && !isSameListType) {
          editor
          .unwrapBlock(
            listType === 'orderedList' ? 'unOrderedList' : 'orderedList'
          )
          .wrapBlock(listType)
        } else {
          editor.insertBlock('list-item')
            .wrapBlock(listType);
        }
      }
    },
    renderBlock (props, editor, next) {
      const { attributes, children, node } = props
      switch (node.type) {
        case 'unOrderedList':
          return <ul {...attributes}>{children}</ul>
        case 'list-item':
          return <li {...attributes}>{children}</li>
        case 'orderedList':
          return <ol {...attributes}>{children}</ol>
        default:
          return next()
      }
    }
  };
}

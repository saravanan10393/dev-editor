import React from "react";

export function blockquotePlugin() {
  return {
    onKeyDown: (evt, editor, next) => {
      if (
        evt.key === 'Enter' &&
        evt.shiftKey === false &&
        editor.getCurrentBlockType() === 'blockquote') {
        editor.insertBlock('paragraph');
      }else {
        return next();
      }
    },
    commands: {
      insertList: (editor, listType) => {
        let isList = editor.isBlockOfType('list-item');
        const isSameListType = editor.value.blocks.some(block => {
          return !!document.getClosest(block.key, parent => parent.type === listType)
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
    renderBlock = (props, editor, next) => {
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

export function utilPlugin() {
  return {
    queries: {
      isMarkActive: (editor, markType) => {
        return editor.value.activeMarks.some(mark => mark.type === markType);
      },
      hasBlock: function hasBlock(editor, blockType) {
        return editor.value.blocks.some(block => block.type === blockType);
      },
      hasSelection(editor) {
        //check whether texts are selected
        return editor.value.selection.isExpanded;
      },
      getCurrentBlockType(editor) {
        return editor.value.startBlock ? editor.value.startBlock.type : "";
      }
    }
  };
}

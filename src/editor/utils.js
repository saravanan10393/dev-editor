export const getVisibleSelectionRect = () => {
  const selection = window.getSelection();
  if (!selection.rangeCount) {
    return null;
  }

  const range = selection.getRangeAt(0);
  if (range.collapsed) {
    return null;
  }
  const boundingRect = range.getBoundingClientRect();
  const { top, right, bottom, left } = boundingRect;

  if (top === 0 && right === 0 && bottom === 0 && left === 0) {
    return null;
  }

  return boundingRect;
};

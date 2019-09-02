import React from "react";
import { findDOMNode } from 'slate-react';

import { HeadingButton } from './heading';
import { BlockquoteButton } from './blockquote';
import { useEsc } from '../../hooks/use.esc'
import { ImageButton } from './image';
import { VideoButton } from './video';

import styles from '../editor.module.css';

export function placeholderPlugin() {
  return {
    renderEditor(props, editor, next) {
      const children = next()
      return (
        <div className={styles.editorContainer}>
          <PlaceholderMenu editor={editor} />
          {children}
        </div>
      )
    }
  }
}

export function PlaceholderMenu({
  editor
}) {
  let [showMenu, toggleMenu] = React.useState(false);
  let [placeholderStyle, setPlaceholderStyle] = React.useState({
    position: 'relative',
    top: "0px"
  });

  /* eslint-disable */
  const getParent = function getParent(node) {
    let parent = editor.value.document.getParent(node.key);
    if (parent.object === 'document') {
      return node;
    }
    return getParent(parent);
  }

  const getBlockNode = function getBlockNode() {
    if (editor.value.startBlock) {
      return getParent(editor.value.startBlock);
    }
    return null;
  }

  React.useEffect(() => {
    const style = {
      position: "relative",
      top: `0px`
    };

    if (editor.value.startBlock) {
      let blockNode = getBlockNode();
      if (!blockNode) return;
      let domNode = findDOMNode(blockNode);
      style.top = `${domNode.offsetTop}px`;
      if (style.top !== placeholderStyle.top) {
        setPlaceholderStyle(style);
      }
    }
  })

  const getToolbarStyle = React.useCallback(() => {
    try {
      let blockNode = getBlockNode();
      if (!blockNode) return {};
      console.log("blcok node ", blockNode, blockNode.type);
      let domNode = findDOMNode(blockNode);
      let getValue = domNode.getBoundingClientRect();
      // 133 - width of the popup / 2 and the icon width / 2
      // 70 - height of the popup
      let left = getValue.x;
      let top = getValue.y;
      return ({
        position: "fixed",
        top: top - 40,
        left: left - 46,
        opacity: 1,
        zIndex: 2
      });
    } catch (err) {
      return {}
    }
  })

  function openMenu() {
    toggleMenu(true);
  }

  const closeMenu = React.useCallback(function closeMenu() {
    toggleMenu(false);
  }, [])

  useEsc(closeMenu);

  return (
    <div
      className={styles.placeholderMenu}
      onMouseOver={openMenu}
      style={placeholderStyle}>
      <div className={styles.placeholderIcon}>
        +
      </div>
      {
        showMenu &&
        <div
          className={styles.inlineToolbar}
          style={getToolbarStyle()}
          onMouseLeave={closeMenu}>
          <HeadingButton editor={editor} />
          <BlockquoteButton editor={editor} />
          <ImageButton editor={editor} />
          <VideoButton editor={editor} />
        </div>
      }
    </div>
  )
}
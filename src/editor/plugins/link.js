import React from 'react';
import isUrl from 'is-url';

import { isImageUrl, isVideoUrl } from './utils';

import { Input } from '../../widgets/input';

import styles from '../editor.module.css';

export function linkPlugin() {
  return {
    onPaste(evt, editor, next) {
      let url = (evt.clipboardData || window.clipboardData).getData('text');
      if(!isUrl(url)) {
        return next();
      }

      if(isImageUrl(url)) {
        editor.insertImage({
          src: url,
          alt: "alt text"
        });
      } else if(isVideoUrl(url)) {
        editor.insertVideo({
          src: url,
          alt: "alt text"
        });
      } else {
        editor
          .insertText(url)
          .moveAnchorTo(editor.value.selection.anchor.offset - url.length)
          .moveEndTo(editor.value.selection.focus.offset)
          .toggleLink({ url })
          .moveToEnd();
      }
    },
    commands: {
      toggleLink(editor, args) {
        if(editor.isLink()) {
          editor.unwrapInline('link');
        }else if(args && isUrl(args.url)) {
          editor.wrapInline({
            type: 'link',
            data: {
              url: args.url
            }
          });
        }
      },
      updateLink(editor, args) {
        if(editor.isLink()) {
          editor.setInlines({
            data: {
              url: args.url
            }
          });
        }
      }
    },
    queries: {
      isLink(editor) {
        return editor.value.inlines.find(inline => inline.type === 'link');
      }
    },
    renderInline({ node, attributes, children }, editor, next) {
      if(node.type === 'link') {
        return <a href={node.data.get('url')} {...attributes}>{children}</a>
      }
      return next();
    }
  }
}

export function LinkButton({
  editor
}) {
  let linkNode = editor.isLink();
  let [showLinkBox, toggleLinkBox] = React.useState(false);

  function getUrl() {
    return linkNode ? linkNode.data.get('url') : "";
  }

  function toggleLink() {
    // console.log("link node ", linkNode);
    // console.log("url from node", url);
    toggleLinkBox(!showLinkBox);
  }

  function setUrl(evt) {
    console.log("typed url ", evt.target.value);
    let updatedUrl = evt.target.value;
    if(!linkNode && updatedUrl) {
      editor.toggleLink({
        url: updatedUrl
      });
    }else if(linkNode && !updatedUrl) {
      editor.toggleLink();
    }else if(linkNode) {
      editor.updateLink({
        url: updatedUrl
      });
    }
    toggleLink();
  }

  return (
    <div className={styles.linkContainer}>
      <button onClick={toggleLink}>Link</button>
      {
        showLinkBox &&
        <div className={styles.linkBox}>
          <Input
            onEnter={setUrl}
            defaultValue={getUrl()}
            onBlur={setUrl}
            placeholder="Paste url"/>
        </div>
      }
    </div>
  )
}

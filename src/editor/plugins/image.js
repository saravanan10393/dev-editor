import React from 'react';
import isUrl from 'is-url';

import {
  ExternalSrcPopup
} from '../../components/ext.src.popup';

export function imagePlugin() {
  return {
    schema: {
      blocks: {
        image: {
          isVoid: true,
        },
      },
    },
    commands: {
      insertImage(editor, args) {
        if(args && isUrl(args.src)) {
          editor.insertBlock({
            type: 'image',
            data: {
              alt: args.alt,
              src: args.src
            }
          })
          .focus();
        }
      }
    },
    renderBlock({ node, attributes, isSelected, isFocused }, editor, next) {
      if(node.type === 'image') {
        let style = {
          maxWidth: "100%",
          height: "auto"
        };
        style = (isSelected || isFocused) ? Object.assign(style, {
          border: "1px solid red"
        }) : style;
        return <img style={style} alt={node.data.get('alt')} src={node.data.get('src')} {...attributes}/>
      }
      return next();
    }
  }
}

export function ImageButton({
  editor
}) {
  let [showDialog, toggleDialog] = React.useState(false);

  function createImage(url) {
    if(!url) {
      return toggleDialog();
    }
    editor.insertImage({
      src: url,
      alt: "alt text"
    });
    toggleDialog();
  }

  return (
    <React.Fragment>
      <button onClick={() => toggleDialog(!showDialog)}>Img</button>
      {
        showDialog &&
        <ExternalSrcPopup title="Enter image url" onDone={createImage}/>
      }
    </React.Fragment>
  )
}

import React from 'react';
import isUrl from 'is-url';

import {
  ExternalSrcPopup
} from '../../components/external.src.popup';

export function videoPlugin() {
  return {
    schema: {
      blocks: {
        video: {
          isVoid: true,
        },
      },
    },
    onKeyDown(evt, editor, next) {
      if(evt.key === 'Enter' && editor.isBlockOfType('video')) {
        return editor.insertBlock('paragraph').focus();
      }
      next();
    },
    commands: {
      insertVideo(editor, args) {
        if(args && isUrl(args.src)) {
          editor.insertBlock({
            type: 'video',
            data: {
              alt: args.alt,
              src: args.src
            }
          })
          .focus();
        }
      }
    },
    renderBlock(props, editor, next) {
      if(props.node.type === 'video') {
        return <Video {...props} editor={editor}/>
      }
      return next();
    }
  }
}

function Video({
  editor,
  node,
  attributes,
  isSelected,
  isFocused
}) {

  function parseQueryString(queryString) {
    var assoc = {};
    var keyValues = (queryString || window.location.search).slice(1).split('&');
    var decode = function(s) {
      return decodeURIComponent(s.replace(/\+/g, ' '));
    };
  
    for (var i = 0; i < keyValues.length; ++i) {
      var key = keyValues[i].split('=');
      if (key.length > 1) {
        assoc[decode(key[0])] = decode(key[1]);
      }
    }
  
    return assoc;
  }

  const getProviderUrl = React.useCallback((url) => {
    if(url.match(/https:\/\/([a-z]*\.)?youtube.com/)) {
      let queryObj = parseQueryString(`?${url.split('?')[1]}`);
      let videoId = queryObj.v;
      return { url: `https://www.youtube.com/embed/${videoId}?wmode=opaque`, provider: "youtube", id: videoId };
    } else if(url.match(/https:\/\/([a-z]*\.)?dailymotion.com/)) {
      let videoId = url.split('/').pop();
      return { url: `https://www.dailymotion.com/embed/video/${videoId}`, provider: "dailymotion", id: videoId };
    } else if(url.match(/https:\/\/([a-z]*\.)?vimeo.com/)) {
      let videoId = url.split('/').pop();
      return { url: `https://player.vimeo.com/video/${videoId}`, provider: "vimeo", id: videoId };
    }

    return { url, isNormalVideo: true };
  }, []);

  /* eslint-disable */
  React.useEffect(() => {
    let video = getProviderUrl(node.data.get('src'));
    editor.setNodeByKey(node.key,
        { 
          type: "video",
          data: Object.assign(
            node.data.toJS(),
            {id: video.id, provider: video.provider}
          )
        }
      )
  }, []);

  let style = {
    maxWidth: "100%",
    height: "auto",
    textAlign: "center"
  };
  style = (isSelected || isFocused) ? Object.assign(style, {
    border: "2px solid red"
  }) : style;

  let video = getProviderUrl(node.data.get('src'))

  return(
    <div style={style} {...attributes}>
      {
        video.isNormalVideo ?
          (
            <video controls>
              <source src={video.url}/>
            </video>
          ) :
          (
            <iframe title="test url" src={video.url} allowFullScreen frameBorder={0} />
          )
      }
    </div>
  );
}

export function VideoButton({
  editor
}) {
  let [showDialog, toggleDialog] = React.useState(false);

  function createVideo(url) {
    if(!url) {
      return toggleDialog();
    }
    editor.insertVideo({
      src: url,
      alt: "alt text"
    });
    toggleDialog();
  }

  return (
    <React.Fragment>
      <button onClick={() => toggleDialog(!showDialog)}>Video</button>
      {
        showDialog &&
        <ExternalSrcPopup title="Enter video url" onDone={createVideo}/>
      }
    </React.Fragment>
  )
}
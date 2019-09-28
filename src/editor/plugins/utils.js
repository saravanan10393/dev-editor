export function utilPlugin() {
  return {
    onKeyDown(evt, editor, next) {
      if(evt.key === 'Enter') {
        return editor.insertBlock('paragraph').focus();
      }
      next();
    },
    queries: {
      isMarkActive: (editor, markType) => {
        return editor.value.activeMarks.some(mark => mark.type === markType);
      },
      isBlockOfType: function hasBlock(editor, blockType) {
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

export function parseQueryString(queryString) {
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

export function getVideoProviderUrl(url) {
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
}

export function isVideoUrl(url) {
  return /(youtube|vimeo|dailymotion)/.test(url);
}


export function isImageUrl(url) {
  return /.(jpg|png|gif|jpeg|webp|svg)/.test(url);
}
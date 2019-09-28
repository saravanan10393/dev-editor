import React from 'react';

export function embedPlugin() {
  return {
    schema: {
      blocks: {
        embed: {
          isVoid: true
        }
      }
    },
    commands: {
      embed(editor, {type, url}) {
        editor.insertBlock({
          type: "embed",
          data: {
            url,
            type
          }
        });
      }
    },
    renderBlock({ node, isSelected, isFocused }, editor, next) {
      let embed = node.data.toJS();
      return node.type === "embed" ?
        <Embed isSelected={isSelected} isFocused={isFocused} url={embed.url} type={embed.type}/>
        : next();
    }
  }
}

function Embed({
   url,
   type,
   isSelected,
   isFocused
}) {
  let ref = React.useRef();
  
  React.useEffect(() => {
    let id = new Date().getTime();
    if(type === "codesandbox") {
      ref.current.innerHTML = `<embed src=${url} height="400" width="100%"/>`;
    }else {
      ref.current.innerHTML = `<a href="${url}" data-card-controls="0" data-card-key="1d5c48f7edc34c54bdae4c37b681ea2b" class="embed-${id}">Loading...</a>`;
      console.log("gist url ", ref.current.innerHTML);
      window.embedly('card', `.embed-${id}`);
    }
  }, [url, type])

  let style = (isSelected || isFocused) ? Object.assign({
    border: "1px solid red"
  }) : {};
  
  return <div ref={ref} style={style}/>
}
const formatsSyntax = {
  bold: (text) => `**${text}**`,
  italic: (text) => `_${text}_`,
  // underline: (text) => `*${text}*`,
  strikeThrough: (text) => `~${text}~`,
}

const getProviderSpecificEmbedUrl = (url, type) => {
  if([
    'instagram',
    'twitter',
    'codesandbox',
    'glitch',
    'slideshare'
  ].includes(type)) {
    let urlSlug = new URL(url).pathname.split('/').reverse();
    return urlSlug[0] || urlSlug[1];
  }
  return url;
}

const blockSyntax = {
  paragraph: (text) => (text + "\n"),
  h1: (text) => text.trim().length ? ("#" + text + "\n") : "\n", //`# ${text}\n\n`,
  h2: (text) => text.trim().length ? ("##" + text + "\n") : "\n", //`## ${text}\n\n`,
  blockquote: (text) => text.trim().length ? (">" + text + "\n") : "\n", //`> ${text}\n\n`,
  image: (text, node) => {
    return `![${node.data.alt}](${node.data.src}) \n`;
  },
  code: (text) => {
    return "```\n" + text + "\n```\n";
  },
  video: (text, node) => {
    return `{% ${node.data.provider} ${node.data.id} %} \n`
  },
  embed: (text, node) => {
    return `{% ${node.data.type} ${getProviderSpecificEmbedUrl(node.data.url, node.data.type)} %} \n`
  },
  orderedList: (text) => text + "\n",
  unOrderedList: (text) => text + "\n",
  "list-item": (text) => text + "\n",
}

export function markdown(slateJson) {
  let str = "";
  for (let node of slateJson.document.nodes) {
    str = str + serializeBlock(node);
  }
  console.log("markdown string", str);
  return str;
}

function serializeBlock(blockNode) {
  let str = "";
  blockNode.nodes.forEach((node, index) => {
    switch(node.object) {
      case "block":
        if(blockNode.type === 'orderedList') {
          str = str + (index + 1) + ". " + serializeBlock(node);
        }else {
          str = str + "* " + serializeBlock(node);
        }
        break;
      case "inline":
        str = str + serializeInline(node);
        break;
      case "text":
        str = str + serializeText(node);
        break;
      default:
        //
    }
  });

  return blockSyntax[blockNode.type](str, blockNode);
}

function serializeInline(node) {
  let str = ``;
  if(node.type === 'link') {
    let linkText = node.nodes.map(serializeText).join('');
    str = `[${linkText}](${node.data.url})`
  }
  return str
}

function serializeText(textNode) {
  let str = textNode.text;
  if(!str) return "";
  for (let mark of textNode.marks || []) {
    str = formatsSyntax[mark.type](str);
  }
  return str;
}

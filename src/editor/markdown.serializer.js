const formatsSyntax = {
  bold: (text) => `**${text}**`,
  italic: (text) => `_${text}_`,
  // underline: (text) => `*${text}*`,
  strikeThrough: (text) => `~${text}~`,
}

const blockSyntax = {
  paragraph: (text) => (text + "\n"),
  h1: (text) => ("# " + text + "\n"), //`# ${text}\n\n`,
  h2: (text) => ("##" + text + "\n"), //`## ${text}\n\n`,
  blockquote: (text) => (">" + text + "\n"), //`> ${text}\n\n`,
  image: (text, node) => {
    return `![${node.data.alt}](${node.data.src}) \n`;
  },
  code: (text) => {
    return "```\n" + text + "\n```\n";
  },
  video: (text, node) => {
    return `{% ${node.data.provider} ${node.data.id} %} \n`
  }
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
  for (let node of blockNode.nodes) {
    str = str + (node.object === 'inline' ? serializeInline(node) : serializeText(node));
  }
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
  for (let mark of textNode.marks || []) {
    str = formatsSyntax[mark.type](str);
  }
  return str;
}

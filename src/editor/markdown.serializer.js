const formatsSyntax = {
  bold: (text) => `**${text}**`,
  italic: (text) => `*${text}*`,
  underline: (text) => `*${text}*`,
  strikeThrough: (text) => `~${text}~`,
}

const blockSyntax = {
  paragraph: (text) => `${text}  `,
  h1: (text) => `# ${text}  `,
  h2: (text) => `## ${text}  `,
  blockquote: (text) => `> ${text}  `,
}

export function markdown(slateJson) {
  let str = ``;
  for (let node of slateJson.document.nodes) {
    str = `${str}${serializeBlock(node)}`;
  }
  return str;
}

function serializeBlock(blockNode) {
  let str = ``;
  for (let node of blockNode.nodes) {
    str = `${str}${serializeText(node)}`;
  }
  return blockSyntax[blockNode.type](str);
}

function serializeText(textNode) {
  let str = textNode.text;
  for (let mark of textNode.marks || []) {
    str = formatsSyntax[mark.type](str);
  }
  return str;
}

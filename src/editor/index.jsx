import React, { useState } from 'react';
import { Value } from 'slate';
import { Editor } from 'slate-react';

import {
  utilPlugin,
  formatPlugin,
  blockquotePlugin,
  headingPlugin,
  codePlugin,
  softBreakPlugin,
  linkPlugin,
  // placeholderPlugin,
  inLineToolbarPlugin,
  imagePlugin,
  videoPlugin,
  listPlugin,
  embedPlugin
} from './plugins';

import { markdown } from './markdown.serializer';
import { useCache } from '../hooks/use.cache';

import styles from './editor.module.css';

const defaultValue = {
  "object": "value",
  "document": {
    "object": "document",
    "nodes": [
      {
        "object": "block",
        "type": "paragraph",
        "nodes": [
          {
            "object": "text",
            "text": ""
          }
        ]
      }
    ]
  }
}

export const DevEditor = React.forwardRef(function DevEditor({
  placeholder
}, ref) {
  let [value, setValue] = useState(Value.fromJSON(defaultValue));
  let [getCache, setCache] = useCache('editor');
  let editor = React.useRef();

  const plugins = React.useMemo(() => [
    formatPlugin(),
    blockquotePlugin(),
    headingPlugin(),
    linkPlugin(),
    softBreakPlugin({ shift: true }),
    imagePlugin(),
    videoPlugin(),
    inLineToolbarPlugin(),
    listPlugin(),
    embedPlugin(),
    // placeholderPlugin(),
    codePlugin(),
    utilPlugin()
  ], [])

  React.useEffect(() => {
    let devContent = localStorage.getItem('dev-content');
    if(devContent && devContent.trim()) {
      setValue(Value.fromJSON(JSON.parse(devContent)));
    }
  }, []);

  React.useEffect(() => {
    return () => {
      requestIdleCallback(() => {
        localStorage.setItem('dev-content', JSON.stringify(value.toJSON()));
      });
    }
  }, [value]);

  function onChange(change) {
    // console.log("js ", change.value.toJS());
    setValue(change.value);
  }

  const editorInterface = React.useMemo(() => {
    let obj = {
      markdown: () => markdown(value.toJS()),
      insertImage: (url, altText = "") => {
        editor.current
          .focus()
          .insertImage({
            src: url,
            alt: altText
          });
      },
      insertVideo: (url) => {
        editor.current
          .focus()
          .insertVideo({
            src: url
          });
      },
      h1() {
        editor.current
          .focus()
          .title('h1');
      },
      h2() {
        editor.current
          .focus()
          .title('h2');
      },
      quote() {
        editor.current
          .focus()
          .blockquote();
      },
      code() {
        editor.current
          .focus()
          .code();
      },
      numberedList() {
        editor.current
          .focus()
          .insertList('orderedList');
      },
      bulletList() {
        editor.current
          .focus()
          .insertList('unOrderedList');
      },
      insertEmbedText(text) {
        editor.current
          .focus()
          .insertBlock('paragraph')
          .focus()
          .insertText(text);
      },
      embed(args) {
        editor.current
          .focus()
          .embed(args);
      }
    };
    console.log("setting editor in cache");
    setCache(obj);
    return obj;
  }, [value, editor, setCache]);



  React.useImperativeHandle(ref, () => {
    return editorInterface
  });

  return (
    <Editor
      ref={editor}
      placeholder={placeholder}
      className={styles.editor}
      onChange={onChange}
      value={value}
      plugins={plugins} />
  )
})


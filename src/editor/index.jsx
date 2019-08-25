import React, { useState } from 'react';
import { Value } from 'slate';
import { Editor } from 'slate-react';

import {
  utilPlugin,
  formatPlugin,
  blockquotePlugin,
  placeholderPlugin,
  headingPlugin,
  softBreakPlugin
} from './plugins';

import { InlineToolbar } from './inline.toolbar';
import { markdown } from './markdown.serializer';

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
            "text": "This is editable "
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
  let editorRef = React.useRef();

  const plugins = React.useMemo(() => [
    utilPlugin(),
    formatPlugin(),
    blockquotePlugin(),
    headingPlugin(),
    placeholderPlugin(),
    softBreakPlugin({ shift: true })
  ], [])

  function onChange(change) {
    // console.log("js ", change.value.toJS());
    setValue(change.value);
  }

  React.useImperativeHandle(ref, () => {
    return {
      markdown: () => markdown(value.toJS())
    }
  });

  return (
    <React.Fragment>
      <Editor
        placeholder={placeholder}
        ref={editorRef}
        className={styles.editor}
        onChange={onChange}
        value={value}
        plugins={plugins} />
      <InlineToolbar editor={editorRef.current ? editorRef.current : null} />
    </React.Fragment>
  )
})


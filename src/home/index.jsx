import React from 'react';

import { Banner } from './banner';
import { DevEditor } from '../editor';

import { ToolBox } from './toolbox';

import styles from './home.module.css';

export function Home() {
  let editorRef = React.useRef();

  function getMarkdown() {
    return editorRef.current.markdown()
  }

  return (
    <div className={styles.container}>
      <Banner />
      <div className={styles.contentContainer}>
        <div className={styles.widgetContainers}>
          <ToolBox />
        </div>
        <div className={styles.editor}>
          <DevEditor ref={editorRef} placeholder="Write your thoughts..." />
        </div>
        <div className={styles.widgetContainers}>
          <PublishSection getMarkdown={getMarkdown} />
        </div>
      </div>
    </div>
  )
}

function PublishSection({
  getMarkdown
}) {

  let [isCopied, setCopied] = React.useState(false);

  function copyToClipboard() {
    let str = getMarkdown();
    let elem = document.createElement('textarea');
    elem.value = str;
    elem.setAttribute('style', "position:fixed; top: '0px';");
    document.body.appendChild(elem);
    elem.select();
    document.execCommand('copy');
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000)
  }

  return (
    <div className={`card ${styles.publishBox}`}>
      <button onClick={copyToClipboard}>
        {isCopied ? 'copied to clipboard' : 'copy as markdown'}
      </button>
    </div>
  )
}
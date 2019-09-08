import React from 'react';

import { Banner } from './banner';
import { DevEditor } from '../editor';
import { PrimaryButton } from '../widgets/button';

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
        <div className={`${styles.widgetContainers} ${styles.left}`}>
          <ToolBox />
        </div>
        <div className={styles.editor}>
          <DevEditor ref={editorRef} placeholder="Write your thoughts..." />
        </div>
        <div className={`${styles.widgetContainers} ${styles.right}`}>
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
      <PrimaryButton onClick={copyToClipboard}>
        {isCopied ? 'copied to clipboard' : 'Copy markdown'}
      </PrimaryButton>
    </div>
  )
}
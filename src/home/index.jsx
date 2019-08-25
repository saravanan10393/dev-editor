import React from 'react';

import { Banner } from './banner';
import { DevEditor } from '../editor';

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
          <ShortCuts />
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

function ShortCuts() {
  return (
    <ul className={`${styles.card} ${styles.shortCuts}`}>
      <li>Shortcuts</li>
      <li>cmd/ctrl + 1 => Heading 1</li>
      <li>cmd/ctrl + 2 => Heading 2</li>
      <li>cmd/ctrl + P => Paragraph</li>
      <li>cmd/ctrl + ' => Quote</li>
      <li>cmd/ctrl + B => Bold</li>
      <li>cmd/ctrl + I => Italic</li>
      {/* <li>cmd/ctrl + U => Underline</li> */}
      <li>cmd/ctrl + L => StrikeThrough</li>
    </ul>
  )
}

function PublishSection({
  getMarkdown
}) {

  let [isCopied, setCopied] = React.useState(false);

  function copyToClipboard() {
    let str = getMarkdown();
    let elem = document.createElement('input');
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
    <div className={styles.card}>
      <button onClick={copyToClipboard}>
        {isCopied ? 'markdown copies' : 'copy as markdown'}
      </button>
    </div>
  )
}
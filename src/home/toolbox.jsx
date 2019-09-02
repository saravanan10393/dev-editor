import React from 'react';

import { useCache } from '../hooks/use.cache';
import { 
  ExternalSrcPopup
} from '../components/external.src.popup';

import styles from './home.module.css';

export function ToolBox() {
  let [getEditor] = useCache('editor');
  let [showPopup, togglePopup] = React.useState(false);
  let [type, setType] = React.useState('');

  const extSrcs = {
    IMAGE: 'image',
    VIDEO: 'video'
  }

  const embeds = [
    {
      id: 'tag',
      label: 'Tag',
      text: "{% tag <user> %}"
    },
    {
      id: 'github',
      label: 'Github',
      text: "{% github <url> %}"
    },
    {
      id: 'gist',
      label: 'Gists',
      text: "{% gist <url> %}"
    },
    {
      id: 'glitch',
      label: 'Glitch',
      text: "{% glitch <glitch_id> %}"
    },
    {
      id: 'codepen',
      label: 'Codepen',
      text: "{% codepen <url> %}"
    },
    {
      id: 'codesandbox',
      label: 'Code sandbox',
      text: "{% codesandbox <box_id> %}"
    },
    {
      id: 'jsfiddle',
      label: 'Js fiddle',
      text: "{% jsfiddle <fiddle_url> result,html,css %}"
    },
    {
      id: 'medium',
      label: 'Medium',
      text: "{% medium <url> %}"
    },
    {
      id: 'twitter',
      label: 'Twitter',
      text: "{% twitter <tweet_id> %}"
    },
    {
      id: 'instagram',
      label: 'Instagram',
      text: "{% instagram <insta_id> %}"
    },
    {
      id: 'slideshare',
      label: 'Slide share',
      text: "{% slideshare <slide_id> %}"
    },
  ]

  const onDone = (url) => {
    if(!url) {
      return togglePopup(false);
    }
    switch(type) {
      case extSrcs.IMAGE:
        getEditor().insertImage(url);
        break;
      case extSrcs.VIDEO:
        getEditor().insertVideo(url);
        break;
      default:
        //
    }
    togglePopup(false);
  }

  const openExtSrc = (type) => {
    setType(type);
    togglePopup(true);
  }

  const embedExtSrc = (embed) => {
    getEditor().insertEmbedText(embed.text);
  }
  
  return (
    <div className={`card ${styles.toolBox}`}>
      <div
        title="Meta+1"
        className={styles.tool}
        onClick={() => getEditor().h1()}>H1</div>
      <div
        title="Meta+2"
        className={styles.tool}
        onClick={() => getEditor().h2()}>H2</div>
      <div
        title="Meta+'"
        className={styles.tool}
        onClick={() => getEditor().quote()}>Quote</div>
      <div
        title="Meta+Shift+c"
        className={styles.tool}
        onClick={() => getEditor().code()}>Code</div>
      <div
        title="Meta+Shift+i"
        className={styles.tool}
        onClick={() => openExtSrc(extSrcs.IMAGE)}>Img</div>
      <div
        title="Meta+Shift+v"
        className={styles.tool}
        onClick={() => openExtSrc(extSrcs.VIDEO)}>Video</div>
      {
        embeds.map(embed => (
          <div
            title={embed.id}
            className={styles.tool}
            onClick={() => embedExtSrc(embed)}>{embed.label}</div>
        ))
      }
      {
        showPopup &&
        <ExternalSrcPopup title={`Enter ${type} url`} onDone={onDone} />
      }
    </div>
  )
}
import React from 'react';
import isUrl from 'is-url';

import { Input } from '../../widgets/input';
import { Overlay } from '../../widgets/overlay';
import { PrimaryButton } from '../../widgets/button';

import styles from './ext.src.popup.module.css';

export function ExternalSrcPopup({
  title = "",
  onDone = () => {}
}){
  let [url, setUrl] = React.useState("");
  let [error, setError] = React.useState("");

  function updateImageUrl(evt) {
    let url = evt.target.value;
    if(isUrl(url)) {
      setUrl(url);
    }else{
      setError("Invalid url");
    }
  }

  return (
    <Overlay onClose={onDone}>
      <div className={`card ${styles.container}`}>
        <h2 className={styles.title}>{title}</h2>
        <Input value={url} onChange={updateImageUrl}/>
        <PrimaryButton disabled={Boolean(error)} onClick={() => onDone(url)}>Done</PrimaryButton>
        {
          error &&
          <p className="error">{error}</p>
        }
      </div>
    </Overlay>
  )
}

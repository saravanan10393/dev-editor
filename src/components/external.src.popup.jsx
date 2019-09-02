import React from 'react';
import isUrl from 'is-url';

import { Input } from '../widgets/input';
import { Overlay } from '../widgets/overlay';

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
      <div className="card">
        <h2>{title}</h2>
        <Input value={url} onChange={updateImageUrl}/>
        {
          error &&
          <p className="error">{error}</p>
        }
        <button disabled={Boolean(error)} onClick={() => onDone(url)}>Done</button>
      </div>
    </Overlay>
  )
}

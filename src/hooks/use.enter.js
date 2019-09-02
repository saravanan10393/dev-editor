import React from 'react';

export function useEnter(elem, cb) {
  elem = elem || document;
  React.useEffect(() => {
    elem.addEventListener('keyDown', (evt) => {
      if(evt.key === 'Enter') {
        cb(evt);
      }
    });
    return () => elem.removeEventListener('keyDown', cb);
  });
}
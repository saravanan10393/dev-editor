import React from 'react';

export function useEsc(cb) {
  React.useEffect(() => {
    function escHandler(evt) {
      if (evt.key === 'Escape') {
        cb(evt);
      }
    }
    document.addEventListener('keydown', escHandler);
    return () => document.removeEventListener('keypress', escHandler)
  }, [cb]);
}
import React from 'react';

const cache = {};
export function useCache(name) {
  const setValue = React.useCallback(function setValue(value){
    if(value === null) {
      delete cache[name];
    }else {
      cache[name] = value;
    }
  }, [name])
  const getValue = React.useCallback(function getValue() {
    return cache[name];
  }, [name])
  return [getValue, setValue];
}
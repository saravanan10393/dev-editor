import React from 'react';

export function Input({
  onEnter = () => {},
  ...restProps
}) {

  let ref = React.useRef();

  React.useEffect(() => {
    let input = ref.current;
    let cb = (evt) => {
      if(evt.key === 'Enter') {
        onEnter(evt);
      }
    };
    input.addEventListener('keydown', cb);
    return () => input.removeEventListener('keydown', cb);
  }, [onEnter]);

  return (
    <input ref={ref} {...restProps} />
  );
}

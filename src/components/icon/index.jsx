import React from 'react';

export const Size = {
  SMALL: 20,
  MEDIUM: 30,
  LARGE: 40
}

const sizeToStyle = {
  20: { height: "2rem", width: "2rem"},
  30: { height: "3rem", width: "3rem"},
  40: { height: "4rem", width: "4rem"}
}

export function Icon({
  name,
  size = Size.SMALL,
  ...restProps
}) {
  let [url, setUrl] = React.useState("");
  React.useEffect(() => {
    import(`./images/${name}.svg`)
      .then(module => setUrl(module.default));
  }, [name]);
  let style = sizeToStyle[size]
  return <img src={url} alt={url} style={style} {...restProps} />
}
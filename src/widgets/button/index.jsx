import React from 'react';

import styles from './button.module.css';

export function Button({
  className = "",
  ...props
}) {
  return <button className={`${styles.button} ${className}`} {...props}/>
}

export function PrimaryButton({
  className = "",
  ...props
}) {
  return <Button className={`${styles.primary} ${className}`} {...props}/>
}
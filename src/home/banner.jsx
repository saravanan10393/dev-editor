import React from 'react';

import { Icon, Size } from '../components/icon';

import styles from './banner.module.css';

export function Banner() {
  return (
    <div className={styles.banner}>
      <Icon name="logo" size={Size.LARGE}/>
      <h2 className={styles.title}>Dev Editor</h2>
      <Icon
        onClick={() => window.open("https://github.com/saravanan10393/dev-editor", "_blank")}
        title="fork it in github"
        name="github"
        size={Size.MEDIUM}/>
    </div>
  )
}

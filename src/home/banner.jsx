import React from 'react';

import styles from './banner.module.css';

export function Banner() {
  return (
    <div className={styles.banner}>
      <h4 className={styles.heading}>Dev Editor</h4>
      <div className="content">
        Editor for easily writing dev.to blogs.
        <a target="_blank" rel="noreferrer noopener" href="https://github.com/saravanan10393/dev-editor">Fork in Github</a>
      </div>
    </div>
  )
}
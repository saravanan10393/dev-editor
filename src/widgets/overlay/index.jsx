import React from 'react';
import ReactDom from 'react-dom';

import { useEsc } from '../../hooks/use.esc';

import styles from './overlay.module.css';

export const Overlay = React.forwardRef(function Overlay({
  children,
  clickToClose = true,
  shouldClose = () => true,
  onClose = () => {},
  onOpen = () => {},
  className = "",
  autoOpen = true,
  ...restProps
}, ref) {
  let [isOpen, setOpen] = React.useState(autoOpen);

  const open = React.useCallback(function open() {
    setOpen(true);
    onOpen();
  }, [onOpen])

  const close = React.useCallback(function close(evt) {
    evt.stopPropagation();
    shouldClose() &&
    setOpen(false);
    onClose();
  }, [onClose, shouldClose])

  //export methods for external refs
  React.useImperativeHandle(ref, ()=> ({
    open: open,
    close: close
  }), [open, close])

  // auto open first time
  React.useEffect(() => {
    open();
  },[open]);
  
  useEsc((evt) => {
    close(evt);
  });

  return isOpen && ReactDom.createPortal(
    <div className={`${styles.container} ${className}`} {...restProps}>
      <div className={styles.portal} onClick={close}/>
      <div className={styles.contentHolder}>
      {
        children
      }
      </div>
    </div>,
    document.body
  );
})
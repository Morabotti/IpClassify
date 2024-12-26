import { SimpleContextMenu } from '@types';
import { useState } from 'react';

interface SimpleContextMenuContract<T> {
  menu: SimpleContextMenu<T>;
  onClose: () => void;
  onMenu: (item: T, useRef: boolean) => (e: React.MouseEvent<HTMLElement>) => void;
}

export function useSimpleContextMenu<T>(): SimpleContextMenuContract<T> {
  const [contextMenu, setContextMenu] = useState<SimpleContextMenu<T>>({
    open: false,
    item: null
  });

  const onMenu = (item: T | null, useRef: boolean) => (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    setContextMenu(prev => {
      if (prev.open) {
        return { item: null, open: false, ref: null };
      }
      if (useRef) {
        return { item, open: true, ref: e.currentTarget };
      }
      return { mouseX: e.clientX + 2, mouseY: e.clientY, item, open: true, ref: null };
    });
  };

  const onClose = () => setContextMenu(prev => ({
    item: prev.item,
    ref: prev.ref,
    open: false
  }));

  return {
    menu: contextMenu,
    onClose,
    onMenu
  };
}

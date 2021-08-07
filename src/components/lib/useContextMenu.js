import { useEffect, useState } from "react";

export default function useContextMenu({ onMenuClose = () => {} }) {
  const [rightClickCoord, setRightClickCoord] = useState({ x: 0, y: 0 });
  const [show, setShow] = useState(false);

  function onClick() {
    if(show) {
      setShow(false);
    }

    onMenuClose();
  }

  function onContextMenu(e) {
    e.preventDefault();

    setShow(true);
    setRightClickCoord({ x: e.clientX, y: e.clientY });
  }

  useEffect(() => {
    document.addEventListener('click', onClick);
    
    return () => {
      document.removeEventListener('click', onClick);
    };
  });
  
  return {
    show,
    coord: rightClickCoord,
    onContextMenu
  };
}
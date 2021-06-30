import React, { useEffect, useState, useRef } from 'react';
import cloneDeep from 'lodash.clonedeep';
import {
  useRecoilState
} from 'recoil';
// import textLayerState from './state/atoms/textLayerState';
import selectedTextIndexState from './state/atoms/selectedTextIndexState';

export default function TextLayer({ initialTextList }) {
  const canvasRef = useRef(null);
  const [mouseDown, setMouseDown] = useState(false);
  const [coord, setCoord] = useState({ x: -1, y: -1 });
  const [selectedTextIndex, setSelectedTextIndex] = useRecoilState(selectedTextIndexState);
  const [canvasTextList, setCanvasTextList] = useState([]);
  const [textList, setTextList] = useState(initialTextList);

  useEffect(() => {
    const ctx = canvasRef.current.getContext('2d');
    // Setup the font style
    ctx.fillStyle = 'red';
    ctx.font = `${textList.fontSize}px Impact, Charcoal, sans-serif`;

    // Clear canvas and repaint all the things
    ctx.clearRect(0, 0, textList.width, textList.height);

    const canvasTexts = textList.textList.map(text => {
      return {
        ...text,
        height: textList.fontSize,
        width: ctx.measureText(text.text).width
      };
    });

    // Iterate through the texts and paint them on
    canvasTexts.forEach((text, index) => {
      ctx.fillText(text.text, text.x, text.y);

      if (index === selectedTextIndex) {
        // Draw a border
        ctx.beginPath();
        ctx.lineWidth = "1";
        ctx.rect(text.x - 5, text.y - text.height, text.width + 10, text.height + 10);
        ctx.stroke();
      }
    });

    setCanvasTextList(canvasTexts);
  }, [textList, selectedTextIndex]);

  function isTextClicked(text, x, y) {
    return (
      x >= text.x
      && x <= (text.x + text.width)
      && (y >= text.y - text.height)
      && y <= text.y
    );
  }

  function onMouseDown(e) {
    setMouseDown(true);

    const pos = getMousePos(canvasRef.current, e);
    const index = canvasTextList.findIndex(text => isTextClicked(text, pos.x, pos.y));
    if (index >= 0) {
      setSelectedTextIndex(index);
      setCoord({
        x: pos.x,
        y: pos.y
      });
    }
  }

  function onMouseUp(e) {
    setMouseDown(false);
    setSelectedTextIndex(-1);
    setCoord({
      x: -1,
      y: -1
    });
  }

  function onMouseMove(e) {
    const pos = getMousePos(canvasRef.current, e);

    if (mouseDown && selectedTextIndex >= 0) {
      let textListClone = cloneDeep(textList);

      const xChange = pos.x - coord.x;
      const yChange = pos.y - coord.y;

      textListClone.textList[selectedTextIndex].x += xChange;
      textListClone.textList[selectedTextIndex].y += yChange;

      setCoord({
        x: pos.x,
        y: pos.y
      });

      setTextList(textListClone);
    }

    const index = canvasTextList.findIndex(text => isTextClicked(text, pos.x, pos.y));
    if (index >= 0) {
      if (mouseDown) {
        canvasRef.current.style.cursor = 'grabbing';
      }
      else {
        canvasRef.current.style.cursor = 'grab';
      }
    }
    else {
      canvasRef.current.style.cursor = 'default';
    }
  }

  function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    };
  }

  return (
    <canvas
      id={textList.getHash()}
      ref={canvasRef}
      height={textList.height}
      width={textList.width}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onMouseMove={onMouseMove}
      className="js-frame-canvas m-auto"
    />
  );
};

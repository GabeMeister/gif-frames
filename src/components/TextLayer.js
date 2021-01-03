import React, { useEffect, useState, useRef } from 'react';
import cloneDeep from 'lodash.clonedeep';

export default function TextLayer({ textLayerModel, onTextMove = () => { } }) {
  const canvasRef = useRef(null);
  const [textLayerData, setTextLayerData] = useState(textLayerModel);
  const [mouseDown, setMouseDown] = useState(false);
  const [coord, setCoord] = useState({ x: -1, y: -1 });
  const [selectedTextIndex, setSelectedTextIndex] = useState(-1);
  const [canvasTextList, setCanvasTextList] = useState([]);

  useEffect(() => {
    const ctx = canvasRef.current.getContext('2d');
    // Setup the font style
    ctx.fillStyle = 'red';
    ctx.font = `${textLayerData.fontSize}px Impact, Charcoal, sans-serif`;

    // Clear canvas and repaint all the things
    ctx.clearRect(0, 0, textLayerData.width, textLayerData.height);

    const canvasTexts = textLayerData.textList.map(text => {
      return {
        ...text,
        height: textLayerData.fontSize,
        width: ctx.measureText(text.text).width
      };
    });

    // Iterate through the texts and paint them on
    canvasTexts.forEach(text => {
      ctx.fillText(text.text, text.x, text.y);
    });

    setCanvasTextList(canvasTexts);
  }, [textLayerData]);

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
    if (mouseDown && selectedTextIndex >= 0) {
      let textLayerDataClone = cloneDeep(textLayerData);
      const pos = getMousePos(canvasRef.current, e);

      const xChange = pos.x - coord.x;
      const yChange = pos.y - coord.y;

      textLayerDataClone.textList[selectedTextIndex].x += xChange;
      textLayerDataClone.textList[selectedTextIndex].y += yChange;

      setCoord({
        x: pos.x,
        y: pos.y
      });

      setTextLayerData(textLayerDataClone);

      onTextMove({
        textLayerData
      });
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
      id={textLayerData.getHash()}
      ref={canvasRef}
      height={textLayerData.height}
      width={textLayerData.width}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onMouseMove={onMouseMove}
      className="js-frame-canvas m-auto"
    />
  );
};

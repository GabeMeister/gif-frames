import React from 'react';
import OnImagesLoaded from 'react-on-images-loaded';
import ImageLayer from './ImageLayer';
import { useRecoilValue } from 'recoil';
import BackgroundTextLayer from './BackgroundTextLayer';
import fontSizeState from "./state/atoms/fontSizeState";

export default function GifRenderer({ frames, onFinish, delay = 10 }) {
  const fontSize = useRecoilValue(fontSizeState);
  
  function onAllImagesLoaded() {
    var gif = new window.GIF({
      workers: 2,
      quality: 10
    });

    // iterate through all canvases and images
    const frameImages = document.querySelectorAll('.gif-renderer .js-frame-img');
    const frameCanvases = document.querySelectorAll('.gif-renderer .js-frame-canvas');

    for (let i = 0; i < frameCanvases.length; i++) {

      // Create new canvas to stuff everything in
      const final = document.createElement('canvas');
      final.width = frames[0].imageLayerData.width;
      final.height = frames[0].imageLayerData.height;
      const ctx = final.getContext('2d');

      // Setup the font style
      ctx.font = `${fontSize}px Impact, Charcoal, sans-serif`;

      // Add image to the canvas
      const img = frameImages[i];
      ctx.drawImage(img, 0, 0);

      // Add text to the canvas
      frames[i].textLayerData.textList.forEach(t => {
        ctx.fillStyle = t.color;
        ctx.fillText(t.text, t.x, t.y);
      });

      // Add the final frame
      gif.addFrame(final, {
        delay: delay
      });
    }

    gif.on('finished', function (blob) {
      onFinish(URL.createObjectURL(blob));
    });

    gif.render();
  }

  return (
    <div className="gif-renderer hidden -ml-96">
      <OnImagesLoaded onLoaded={onAllImagesLoaded}>
        {frames.map((f, i) => {
          return (
            <div key={`rendered-frame-${f.getHash()}`}>
              <ImageLayer
                key={`rendered-image-${f.getHash()}`}
                imageLayerData={f.imageLayerData}
              />
              <BackgroundTextLayer
                key={`rendered-text-${f.getHash()}`}
                textList={f.textLayerData.textList}
              />
            </div>
          );
        })}
      </OnImagesLoaded>
    </div>
  );
};

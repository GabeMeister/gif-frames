import React from 'react';
import OnImagesLoaded from 'react-on-images-loaded';
import ImageLayer from './ImageLayer';
import TextLayer from './TextLayer';

export default function GifRenderer({ frames, onFinish, delay, fontSize = 32 }) {
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
      final.width = frames[0].imageLayerModel.width;
      final.height = frames[0].imageLayerModel.height;
      const ctx = final.getContext('2d');

      // Setup the font style
      ctx.fillStyle = 'red';
      ctx.font = `${fontSize}px Impact, Charcoal, sans-serif`;

      // Add image to the canvas
      const img = frameImages[i];
      ctx.drawImage(img, 0, 0);

      // Add text to the canvas
      frames[i].textLayerModel.textList.forEach(t => {
        ctx.fillText(t.text, t.x, t.y);
      });

      // Add the final frame
      gif.addFrame(final, {
        delay: delay * 7
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
                imageLayerModel={f.imageLayerModel}
              />
              <TextLayer
                key={`rendered-text-${f.getHash()}`}
                textLayerModel={f.textLayerModel}
              />
            </div>
          );
        })}
      </OnImagesLoaded>
    </div>
  );
};

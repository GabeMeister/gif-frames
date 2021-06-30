import React from 'react';

export default function ImageLayer({ imageLayerData }) {
  console.log('***** imageLayerData.dataUrl *****', imageLayerData.dataUrl);
  return (
    <img
      src={imageLayerData.dataUrl}
      alt={`frame-thumbnail`}
      className="js-frame-img select-none m-auto"
    />
  );
};

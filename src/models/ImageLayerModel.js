import md5 from 'md5';

function ImageLayerModel({ dataUrl, height, width }) {
  this.dataUrl = dataUrl;
  this.height = height;
  this.width = width;
}

ImageLayerModel.prototype.getHash = function () {
  const val = md5(
    JSON.stringify(this.dataUrl)
    + JSON.stringify(this.height)
    + JSON.stringify(this.width)
  );

  return val;
};

ImageLayerModel.initFromCanvas = function ({ canvas }) {
  return new ImageLayerModel({
    dataUrl: canvas.toDataURL(),
    height: canvas.height,
    width: canvas.width
  });
};

export default ImageLayerModel;

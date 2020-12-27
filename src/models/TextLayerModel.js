import md5 from 'md5';

function TextLayerModel({ height, width, textList = [], fontSize = 32 }) {
  this.height = height;
  this.width = width;
  this.textList = textList;
  this.fontSize = fontSize;
}

TextLayerModel.prototype.addText = function (text) {
  this.textList.push({
    text,
    x: this.width / 2,
    y: this.height / 2
  });
};

TextLayerModel.prototype.getHash = function () {
  const val = md5(
    + JSON.stringify(this.height)
    + JSON.stringify(this.width)
    + JSON.stringify(this.textList)
    + JSON.stringify(this.fontSize)
  );

  return val;
};

TextLayerModel.initFromCanvas = function ({ canvas, fontSize = 32 }) {
  return new TextLayerModel({
    height: canvas.height,
    width: canvas.width,
    textList: [],
    fontSize
  });
};

export default TextLayerModel;

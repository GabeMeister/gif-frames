import md5 from 'md5';

function Frame({ dataUrl, textList, height, width, fontSize }) {
  this.dataUrl = dataUrl;
  this.textList = textList;
  this.height = height;
  this.width = width;
  this.fontSize = fontSize;
}

Frame.prototype.addText = function (text) {
  this.textList.push({
    text,
    x: 100,
    y: 100
  });
}

Frame.prototype.getHash = function () {
  const val = md5(
    JSON.stringify(this.dataUrl)
    + JSON.stringify(this.textList)
    + JSON.stringify(this.height)
    + JSON.stringify(this.width)
    + JSON.stringify(this.fontSize)
  );

  return val;
}

Frame.initFromCanvas = function ({ canvas, fontSize = 32 }) {
  let img = canvas.getImage();

  return new Frame({
    dataUrl: img.toDataURL(),
    height: img.height,
    width: img.width,
    textList: [],
    fontSize: fontSize
  });
}

export default Frame;

import md5 from 'md5';

// class Frame {
//   constructor(canvas) {
//     let img = canvas.getImage();

//     this.dataUrl = img.toDataURL();
//     this.height = img.height;
//     this.width = img.width;
//     this.textList = [];
//   }

//   addText(text) {
//     this.textList.push({
//       text,
//       x: 100,
//       y: 100
//     });
//   }

//   getHash() {
//     const val = md5(
//       JSON.stringify(this.dataUrl)
//       + JSON.stringify(this.textList)
//       + JSON.stringify(this.height)
//       + JSON.stringify(this.width)
//     );

//     return val;
//   }
// }

// export default Frame;

function Frame({ dataUrl, textList, height, width }) {
  this.dataUrl = dataUrl;
  this.textList = textList;
  this.height = height;
  this.width = width;
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
  );

  return val;
}

Frame.initFromCanvas = function (canvas) {
  let img = canvas.getImage();

  return new Frame({
    dataUrl: img.toDataURL(),
    height: img.height,
    width: img.width,
    textList: []
  });
}

export default Frame;

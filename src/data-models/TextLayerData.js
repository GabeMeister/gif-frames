import md5 from "md5";

class TextLayerData {
  constructor(height, width, textList = [], fontSize = 32) {
    this.height = height;
    this.width = width;
    this.textList = textList;
    this.fontSize = fontSize;
  }

  addText(text) {
    this.textList.push({
      text,
      x: this.width / 2,
      y: this.height / 2,
    });
  }

  getHash() {
    const val = md5(
      +JSON.stringify(this.height) +
        JSON.stringify(this.width) +
        JSON.stringify(this.textList) +
        JSON.stringify(this.fontSize)
    );

    return val;
  }

  static initFromCanvas(canvas, fontSize = 32) {
    return new TextLayerData(
      canvas.height,
      canvas.width,
      [],
      fontSize
    );
  }
}

export default TextLayerData;

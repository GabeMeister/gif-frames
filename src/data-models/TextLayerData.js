import md5 from "md5";


function idFromStr(str) {
  return str.replace(/\s+/g, '-').toLowerCase();
}

class TextLayerData {
  constructor(height, width, textList = [], fontSize = 32) {
    this.height = height;
    this.width = width;
    this.textList = textList;
    this.fontSize = fontSize;
  }

  addText(text, x = this.width / 2, y = this.height / 2) {
    const id = md5(idFromStr(text));
    this.textList.push({
      id,
      text,
      x: this.width / 2,
      y: this.height / 2
    });

    return id;
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

import md5 from "md5";

const COLORS = [
  'red',
  'blue',
  'orange',
  'green',
  'black',
  'purple',
  'gray',
  'pink',
  'violet'
];

function idFromStr(str) {
  return str.replace(/\s+/g, '-').toLowerCase();
}

class TextLayerData {
  constructor(height, width, textList = []) {
    this.height = height;
    this.width = width;
    this.textList = textList;
  }

  addText(text, x = this.width / 2, y = this.height / 2) {
    if(this.textList.length > COLORS.length) {
      throw new Error('Too many texts added, not enough colors to support');
    }
    
    const id = md5(idFromStr(text));
    this.textList.push({
      id,
      text,
      x: this.width / 2,
      y: this.height / 2,
      color: COLORS[this.textList.length]
    });

    return id;
  }

  getHash() {
    const val = md5(
      JSON.stringify(this.height) +
      JSON.stringify(this.width) +
      JSON.stringify(this.textList)
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

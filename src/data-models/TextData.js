import md5 from "md5";

function idFromStr(str) {
  return md5(str.replace(/\s+/g, '-').toLowerCase() + (new Date()).toString());
}

class TextData {
  constructor(text, color) {
    this.id = idFromStr(text);
    this.text = text;
    this.color = color;
  }
}

export default TextData;
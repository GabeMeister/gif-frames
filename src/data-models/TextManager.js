import TextData from "./TextData";

const COLORS = [
  '#FF4136', // red
  '#7FDBFF', // blue
  '#FF851B', // orange
  '#2ECC40', // green
  '#F012BE', // pink
  '#FFDC00', // yellow
  '#DDDDDD', // silver
  '#01FF70'  // lime green
];

// A class to keep track of all pieces of text the user enters
class TextManager {
  constructor() {
    this._textList = [];
  }

  createText(text) {
    if(this._textList.length >= COLORS.length) {
      throw new Error('Too many texts added, not enough colors to support');
    }

    const newText = new TextData(
      text,
      COLORS[this._textList.length]
    );
    this._textList.push(newText);

    return newText;
  }

  empty() {
    return this._textList.length === 0;
  }

  getAll() {
    return this._textList;
  }

  getAllExcept(excludedIds) {
    return this._textList.filter(t => !excludedIds.includes(t.id));
  }

  getTextById(id) {
    return this._textList.find(text => text.id === id);
  }

  deleteTextById(id) {
    this._textList = this._textList.filter(t => t.id !== id);
  }

  deleteAll() {
    this._textList = [];
  }
}

export default new TextManager();

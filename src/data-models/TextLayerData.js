import md5 from "md5";
import TextPlacement from "./TextPlacement";

class TextLayerData {
  constructor(height, width, textPlacements = []) {
    this.height = height;
    this.width = width;
    this._textPlacements = textPlacements;
  }

  addTextPlacement(textId) {
    this._textPlacements.push(new TextPlacement(textId, this.width / 2, this.height / 2));
  }

  getTextPlacement(textId) {
    return this._textPlacements.find(t => t.textId === textId);
  }

  getTextPlacements() {
    return this._textPlacements;
  }

  getVisibleTextPlacements() {
    return this._textPlacements.filter(t => t.isVisible);
  }

  deleteTextPlacement(textId) {
    this._textPlacements = this._textPlacements.filter(t => t.textId !== textId);
  }

  getTextPlacementsWithout(excludedTextIds) {
    let final = [];
    for(let i = 0; i < this._textPlacements.length; i++) {
      if(!excludedTextIds.includes(this._textPlacements[i].textId)) {
        final.push(this._textPlacements[i]);
      }
    }

    return final;
  }

  getVisibleTextPlacementsWithout(excludedTextIds) {
    let final = [];
    for(let i = 0; i < this._textPlacements.length; i++) {
      if(!excludedTextIds.includes(this._textPlacements[i].textId) && this._textPlacements[i].isVisible) {
        final.push(this._textPlacements[i]);
      }
    }

    return final;
  }

  getHash() {
    const val = md5(
      JSON.stringify(this.height) +
      JSON.stringify(this.width) +
      JSON.stringify(this.canvasTextList)
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

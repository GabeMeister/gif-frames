import md5 from "md5";
import TextPlacement from "./TextPlacement";

class TextLayerData {
  constructor(height, width, textPlacements = []) {
    this.height = height;
    this.width = width;
    this.textPlacements = textPlacements;
  }

  addTextPlacement(textId) {
    this.textPlacements.push(new TextPlacement(textId, this.width / 2, this.height / 2));
  }

  getTextPlacement(textId) {
    return this.textPlacements.find(t => t.textId === textId);
  }

  deleteTextPlacement(textId) {
    this.textPlacements = this.textPlacements.filter(t => t.textId !== textId);
  }

  getTextListWithout(excludedTextIds) {
    let final = [];
    for(let i = 0; i < this.textPlacements.length; i++) {
      if(!excludedTextIds.includes(this.textPlacements[i].textId)) {
        final.push(this.textPlacements[i]);
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

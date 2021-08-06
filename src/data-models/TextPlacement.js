import TextManager from "./TextManager";

// A class that references a text instance by id, but keeps track of extra
// things that are associated with the placement of the text on the canvas,
// rather than the text itself.
class TextPlacement {
  constructor(id, x, y, isVisible = false) {
    // The textId must refer to an id that exists in the global texts array
    this.textId = id;
    this.x = x;
    this.y = y;
    this.isVisible = isVisible;
  }

  getWidth(ctx) {
    const textMetrics = ctx.measureText(this.getLinkedTextValue());
    return textMetrics.width;
  }

  getHeight(ctx) {
    const textMetrics = ctx.measureText(this.getLinkedTextValue());
    return textMetrics.fontBoundingBoxAscent - textMetrics.fontBoundingBoxDescent;
  }

  // The "linked" text is the text in the global text array
  getLinkedText() {
    return TextManager.getTextById(this.textId);
  }

  getLinkedTextId() {
    return this.getLinkedText().id;
  }

  getLinkedTextColor() {
    return this.getLinkedText().color;
  }

  getLinkedTextValue() {
    return this.getLinkedText().text;
  }
}

export default TextPlacement;

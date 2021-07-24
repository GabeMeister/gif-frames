import md5 from 'md5';

import ImageLayerData from './ImageLayerData';
import TextLayerData from './TextLayerData';

class FrameData {
  constructor(canvas) {
    this.imageLayerData = ImageLayerData.initFromCanvas(canvas);
    this.textLayerData = TextLayerData.initFromCanvas(canvas);
  }

  addTextPlacement(textId) {
    this.textLayerData.addTextPlacement(textId);
  }

  getHash() {
    const val = md5(
      JSON.stringify(this.imageLayerData.getHash())
      + JSON.stringify(this.textLayerData.getHash())
    );

    return val;
  }

  getTextPlacement(textId) {
    return this.textLayerData.getTextPlacement(textId);
  }

  hasTextPlacement(textId) {
    return !!this.getTextPlacement(textId);
  }

  deleteTextPlacement(textId) {
    this.textLayerData.deleteTextPlacement(textId);
  }

  // Get the list of all texts, optionally exclude specified texts by id
  getTextList() {
    return this.textLayerData.textPlacements;
  }

  getTextListWithout(excludedTextIds) {
    return this.textLayerData.getTextListWithout(excludedTextIds);
  }
}

export default FrameData;

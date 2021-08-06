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

  deleteText(textId) {
    this.textLayerData.deleteTextPlacement(textId);
  }

  // Get the list of all texts, optionally exclude specified texts by id
  getTextList() {
    return this.textLayerData.getTextPlacements();
  }

  getVisibleTextList() {
    return this.textLayerData.getVisibleTextPlacements();
  }

  // Same as getTextList() but optionally exclude some text ids
  getTextListWithout(excludedTextIds) {
    return this.textLayerData.getTextPlacementsWithout(excludedTextIds);
  }

  getVisibleTextListWithout(excludedTextIds) {
    return this.textLayerData.getVisibleTextPlacementsWithout(excludedTextIds);
  }

  setTextPlacementVisibility(textId, isVisible) {
    return this.getTextPlacement(textId).isVisible = isVisible;
  }
}

export default FrameData;

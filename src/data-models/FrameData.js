import md5 from 'md5';

import ImageLayerData from './ImageLayerData';
import TextLayerData from './TextLayerData';

class FrameData {
  constructor(canvas) {
    this.imageLayerData = ImageLayerData.initFromCanvas(canvas);
    this.textLayerData = TextLayerData.initFromCanvas(canvas);
  }

  getHash() {
    const val = md5(
      JSON.stringify(this.imageLayerData.getHash())
      + JSON.stringify(this.textLayerData.getHash())
    );

    return val;
  };
}

export default FrameData;

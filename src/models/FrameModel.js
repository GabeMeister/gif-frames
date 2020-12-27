import md5 from 'md5';

import ImageLayerModel from './ImageLayerModel';
import TextLayerModel from './TextLayerModel';

function FrameModel({ canvas }) {
  this.imageLayerModel = ImageLayerModel.initFromCanvas({ canvas });
  this.textLayerModel = TextLayerModel.initFromCanvas({ canvas });
}

FrameModel.prototype.getHash = function () {
  const val = md5(
    JSON.stringify(this.imageLayerModel.getHash())
    + JSON.stringify(this.textLayerModel.getHash())
  );

  return val;
};

export default FrameModel;

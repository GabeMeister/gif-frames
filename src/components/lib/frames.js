// import selectedTextIdState from "../state/atoms/selectedTextIdState";
import cloneDeep from "clone-deep";

export function renderText(currentFrames, frameIdx, selectedTextId, x, y) {
    if(!selectedTextId) {
      // Don't worry about doing anything if we don't have any text to work with
      return currentFrames;
    }

    let framesCpy = cloneDeep(currentFrames);
    let selectedText = framesCpy[frameIdx]
      .textLayerData
      .textList
      .find(textData => textData.id === selectedTextId);

    // Look at the PositionBuffer for the most recent place that the user dragged to
    selectedText.x = x;
    selectedText.y = y;

    return framesCpy;
  }
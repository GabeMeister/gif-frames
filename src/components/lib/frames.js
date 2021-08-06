import cloneDeep from "clone-deep";

export function renderText(currentFrames, frameIdx, selectedTextId, x, y) {
  if(!selectedTextId) {
    // Don't worry about doing anything if we don't have any selected text to
    // work with
    return currentFrames;
  }

  let framesCpy = cloneDeep(currentFrames);
  let selectedTextPlacement = framesCpy[frameIdx].getTextPlacement(selectedTextId);

  // Look at the PositionBuffer for the most recent place that the user dragged to
  selectedTextPlacement.x = x;
  selectedTextPlacement.y = y;

  framesCpy[frameIdx].setTextPlacementVisibility(selectedTextId, true);

  return framesCpy;
}
import cloneDeep from "lodash.clonedeep";
import { useRecoilState, useRecoilValue } from "recoil";
import autoPositionedTextIndicesState from "../state/atoms/autoPositionedTextIndicesState";
import frameIndexState from "../state/atoms/frameIndexState";
import selectedTextIdState from "../state/atoms/selectedTextIdState";

/*
 * {
 *    textId1: index1,
 *    textId2: index2
 * }
 *
 * Simple mapping of textId -> index where index is the frame number of where a
 * text was auto-positioned by the program instead of manually positioned by the
 * user.
 */
export default function useAutoPositionedTextIndices() {
  const [
    mapping,
    setMapping
  ] = useRecoilState(autoPositionedTextIndicesState);
  const frameIdx = useRecoilValue(frameIndexState);
  const selectedTextId = useRecoilValue(selectedTextIdState);

  function updateAutoPosition() {
    let mappingCpy = cloneDeep(mapping);

    if(mappingCpy[selectedTextId] && frameIdx >= mappingCpy[selectedTextId]) {
      mappingCpy[selectedTextId] = frameIdx + 1;
    }

    setMapping(mappingCpy);
  }

  function initAutoPosition(textId, index) {
    let mappingCpy = cloneDeep(mapping);
    mappingCpy[textId] = index;

    setMapping(mappingCpy);
  }

  function deleteAutoPosition(textId) {
    let mappingCpy = cloneDeep(mapping);
    delete mappingCpy[textId];

    setMapping(mappingCpy);
  }
  
  return {
    initAutoPosition,
    updateAutoPosition,
    deleteAutoPosition,
    autoPositionedTextIndices: mapping
  };
}
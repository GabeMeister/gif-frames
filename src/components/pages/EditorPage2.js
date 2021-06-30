import React, { useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import styled from "styled-components";
import { useRecoilState } from "recoil";
import gifFrames from "gif-frames";

import Sidebar from "../Sidebar";
import Button from "../Button";
import FrameData from "../../data-models/FrameData";
import framesState from "../../components/state/atoms/framesState";
import ImageLayer from "../ImageLayer";

const StyledEditorPageDiv = styled.div`
  width: 1024px;
  background-color: lightgray;
  margin: auto;
`;

const AddTextBtn = styled(Button)`
  margin-left: 5px;
`;

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function EditorPage2() {
  const textRef = useRef();
  const [frames, setFrames] = useRecoilState(framesState);

  // Retrieve the gifUrl query param
  let query = useQuery();
  const gifUrl = query.get("gifUrl");

  function addText(text) {}

  useEffect(() => {
    // If we don't have a gif url don't do anything, we're about to redirect
    // back to the home page anyway
    if (!gifUrl) {
      return;
    }

    gifFrames({
      url: gifUrl,
      frames: "all",
      outputType: "canvas",
      cumulative: true,
    }).then((frames) => {
      const extractedFrames = frames.map((frame) => {
        const canvas = frame.getImage();
        return new FrameData(canvas);
      });

      setFrames(extractedFrames);
    });
  }, [gifUrl, setFrames]);

  console.log(frames.length && frames[0].imageLayerData);
  return (
    <StyledEditorPageDiv>
      <Sidebar />
      {frames.length !== 0 && (
        <ImageLayer
          key={`img-${frames[10].getHash()}`}
          imageLayerData={frames[10].imageLayerData}
        />
      )}
      <input type="text" ref={textRef} />
      <AddTextBtn onClick={addText}>Add</AddTextBtn>
    </StyledEditorPageDiv>
  );
}

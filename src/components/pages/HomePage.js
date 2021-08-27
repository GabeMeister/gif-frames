import React, { useEffect, useState } from 'react';
import {
  Redirect
} from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import styled from 'styled-components';

import TextManager from '../../data-models/TextManager';
import GifSearcher from '../GifSearcher';
import GifUploader from '../GifUploader';
import RadioTab from '../RadioTab';
import framesState from '../state/atoms/framesState';
import selectedTextIdState from '../state/atoms/selectedTextIdState';
import Spacer from '../Spacer';

const StyledHomePage = styled.div`
  padding: 20px;
  padding-top: 40px;
  max-width: 90%;
  margin: auto;
`;

const StyledHeadline = styled.h1`
  text-align: center;
  font-size: 80px;
`;

export default function HomePage() {
  const [gifUrl, setGifUrl] = useState('');
  const [redirecting, setRedirecting] = useState(false);
  const setFrames = useSetRecoilState(framesState);
  const setSelectedTextId = useSetRecoilState(selectedTextIdState);

  function onSearchComplete(url) {
    setGifUrl(url);
    setRedirecting(true);
  }

  function onGifUploaded(file) {
    setGifUrl(URL.createObjectURL(file));
    setRedirecting(true);
  }

  useEffect(() => {
    setFrames([]);
    setSelectedTextId(null);
    TextManager.deleteAll();
  }, [setFrames, setSelectedTextId]);

  return (
    <>
      {redirecting ? (
        <Redirect to={`/editor?gifUrl=${gifUrl}`} />
      ) : (
          <StyledHomePage className="__StyledHomePage">
            <StyledHeadline className="AgentOrange">Text Gif</StyledHeadline>
            <Spacer height="40px" />
            <RadioTab options={[
              {
                name: 'search',
                displayName: 'Search',
                content: (
                  <GifSearcher onGifSelected={url => onSearchComplete(url)} />
                )
              },
              {
                name: 'file',
                displayName: 'Upload',
                content: (
                  <GifUploader onGifUploaded={file => onGifUploaded(file)} />
                )
              }
            ]} />
          </StyledHomePage>
        )}
    </>
  );
}

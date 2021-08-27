import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import { Masonry } from 'masonic';

import { useGifSearch } from './lib/hooks';
import Button from './Button';
import LoadingAnimation from './LoadingAnimation';
import StyledTextInput from './styled-components/StyledTextInput';
import GifThumbnail from './GifThumbnail';
import { useCallback } from 'react';

const StyledGifSearcher = styled.div`

`;

const StyledSearchWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const StyledNextButton = styled(Button)`
  display: ${props => props.show ? 'inline' : 'none'}
`;

const LoadingAnimationWrapper = styled.div`
  text-align: center;
  margin-top: 20px;
`;

const StyledMasonryWrapper = styled.div`
  margin-top: 20px;
`;

export default function GifSearcher({ onGifSelected }) {
  const searchWordRef = useRef(null);
  const [searchWord, setSearchWord] = useState('');
  const [gifs, gifsLoading, gifsError] = useGifSearch({ text: searchWord });
  const [selectedGif, setSelectedGif] = useState(null);

  const GifThumbnailWrapper = useCallback(props => {
    const data = props.data;

    return (
      <GifThumbnail
        {...props}
        selected={selectedGif && selectedGif.id === data.id}
        onClick={() => setSelectedGif(data)}
      />
    );
  }, [selectedGif]);

  return (
    <StyledGifSearcher className="__StyledGifSearcher">
      <StyledSearchWrapper className="__StyledSearchWrapper">
        <StyledTextInput
          className="__StyledSearchInput"
          ref={searchWordRef}
          type="text"
          value={searchWord}
          onChange={() => setSearchWord(searchWordRef.current.value)}
          placeholder="Search for a gif..."
        />
        <StyledNextButton
          className="__StyledNextButton"
          show={selectedGif !== null}
          onClick={() => onGifSelected(selectedGif.url)}
        >
          Next →
        </StyledNextButton>
      </StyledSearchWrapper>
      {gifsLoading && (
        <LoadingAnimationWrapper className="__LoadingAnimationWrapper">
          <LoadingAnimation />
        </LoadingAnimationWrapper>
      )}
      {gifsError && (
        <div>Error occurred while loading gifs...</div>
      )}
      {!!gifs.length && (
        <StyledMasonryWrapper>
          <Masonry
            items={gifs}
            columnGutter={15}
            columnWidth={250}
            render={GifThumbnailWrapper}
          />
        </StyledMasonryWrapper>
      )}
    </StyledGifSearcher>
  );
};

import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import Button from './Button';
import StyledTextInput from './styled-components/StyledTextInput';

import { useGifSearch } from './lib/hooks';

const StyledGifSearcher = styled.div`
`;

const StyledSearchWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const StyledNextButton = styled(Button)`
  display: ${props => props.show ? 'inline' : 'none'}
`;

const StyledLoadingText = styled.div`
  text-align: center;
  margin-top: 20px;
`;

const StyledGifViewer = styled.div`
  width: 1600px;
  margin: auto;
  margin-top: 20px;
  height: 650px;
  overflow: scroll;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;

  // WEIRD HACK: put a child container in a parent div where the child container
  // is wider than the parent
  position: absolute;
  left: 0;
  right: 0;
`;

const StyledThumbnailWrapper = styled.div`
  margin-right: 10px;
  margin-top: 10px;
  max-height: 200px;
  width: 300px;
  object-fit: contain;
`;

const StyledThumbnail = styled.img`
  cursor: pointer;
  max-width: 300px;
  max-height: 200px;
  border: ${props => props.selected ? '10px solid lightgreen' : 'none'};
  box-sizing: border-box;
`;

export default function GifSearcher({ onGifSelected }) {
  const searchWordRef = useRef(null);
  const [hoveredGifId, setHoveredGifId] = useState('');
  const [searchWord, setSearchWord] = useState('');
  const [gifs, gifsLoading, gifsError] = useGifSearch({ text: searchWord });
  const [selectedGif, setSelectedGif] = useState(null);

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
        <StyledLoadingText className="__StyledLoadingText">Loading...</StyledLoadingText>
      )}
      {gifsError && (
        <div>Error occurred while loading gifs...</div>
      )}
      {!!gifs.length && (
        <StyledGifViewer className="__StyledGifViewer">
          {
            gifs.map(gif => (
              <StyledThumbnailWrapper>
                <StyledThumbnail
                  className="__StyledThumbnail"
                  selected={selectedGif !== null && gif.id === selectedGif.id}
                  key={gif.id}
                  alt="gif_thumbnail_preview"
                  src={(hoveredGifId === gif.id) || (selectedGif !== null && selectedGif.id === gif.id) ? gif.url : gif.thumbnail}
                  onMouseEnter={() => setHoveredGifId(gif.id)}
                  onMouseLeave={() => setHoveredGifId('')}
                  onClick={() => {
                    setSelectedGif(gif);
                  }}
                />
              </StyledThumbnailWrapper>
            ))
          }
        </StyledGifViewer>
      )}
    </StyledGifSearcher>
  );
};

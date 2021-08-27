import React, { useState } from 'react';
import styled from 'styled-components';

const StyledGifThumbnail = styled.div`
  min-height: 150px;
  width: 100%;
  display: flex;
  align-items: center;
  box-sizing: border-box;
  justify-content: center;
  border-radius: 5px;
  background-color: #f5f5f5;
  cursor: pointer;
`;

const StyledImage = styled.img`
  width: 100%;
  border-radius: 5px;
  box-shadow: 0 5px 10px rgba(0, 0, 0, .12);
  border: ${props => props.selected ? '8px solid green' : '0'}
`;

const StyledLoadingAnimation = styled.img`
  @keyframes fading {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;   
    }
  }

  animation: fading ease-in .5s;
  width: 12%;
  position: absolute;
`;

export default function GifThumbnail({ data, selected, onClick }) {
  const [showGif, setShowGif] = useState(false);
  const [loading, setLoading] = useState(true);
  
  return (
    <StyledGifThumbnail
      onMouseEnter={() => {
        setLoading(true);
        setShowGif(true);
      }}
      onMouseLeave={() => setShowGif(false)}
      onClick={onClick}
    >
      {(selected || showGif) ? (
        <StyledImage
          src={data.url}
          alt="gif-img"
          onLoad={() => {
            setLoading(false);
          }}
          selected={selected}
        />
      ) : (
        <StyledImage
          src={data.thumbnail}
          alt="thumbnail-img"
          onLoad={() => {
            setLoading(false);
          }}
          selected={selected}
        />
      )}
      {loading && (
        <StyledLoadingAnimation
          src="loading-circle.gif"
        />
      )}
    </StyledGifThumbnail>
  );
}
import React from 'react';
import styled from 'styled-components';

const StyledImageLayerImg = styled.img`
  position: absolute;
  user-select: none;
  border-radius: 3px;
`;

export default function ImageLayer({ imageLayerData }) {
  return (
    <StyledImageLayerImg
      src={imageLayerData.dataUrl}
      alt={`frame-thumbnail`}
    />
  );
};

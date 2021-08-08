import React from 'react';
import styled from 'styled-components';

const StyledImageLayerImg = styled.img`
  position: absolute;
  select: none;
`;

export default function ImageLayer({ imageLayerData }) {
  return (
    <StyledImageLayerImg
      src={imageLayerData.dataUrl}
      alt={`frame-thumbnail`}
      className="select-none m-auto"
    />
  );
};

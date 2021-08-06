import React from 'react';
import { Link as ReactRouterLink } from 'react-router-dom';

export default function Link({
  to,
  text
}) {
  return (
    <ReactRouterLink to={to}>{text}</ReactRouterLink>
  )
}
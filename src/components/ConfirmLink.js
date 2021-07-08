import React from 'react';
import { Link } from 'react-router-dom';

// Simple link tag that confirms with the user before navigating
export default function ConfirmLink({
  to,
  text = '← Back to Home',
  confirmText = 'Are you sure? Any unsaved changes will be lost.'
}) {
  function onLinkClick(evt) {
    const response = window.confirm(confirmText);
    if(!response) {
      evt.preventDefault();
    }
  }
  
  return (
    <Link to={to} onClick={onLinkClick}>{text}</Link>
  )
}
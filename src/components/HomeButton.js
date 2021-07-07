import React from 'react';
import { Link } from 'react-router-dom';

export default function HomeButton() {
  function onNavigateHome(evt) {
    const response = window.confirm('Are you sure? Any unsaved changes will be lost.');
    if(!response) {
      evt.preventDefault();
    }
  }
  
  return (
    <Link to="/" onClick={onNavigateHome}>← Back to Home</Link>
  )
}
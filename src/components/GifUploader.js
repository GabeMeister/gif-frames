import React from 'react';

export default function GifUploader({ onGifUploaded }) {
  function checkGifUpload(evt) {
    const file = evt.target.files[0];

    if (file.name.endsWith('.gif')) {
      onGifUploaded(file);
    }
    else {
      alert('Please upload a .gif file');
      evt.preventDefault();
    }
  }

  return (
    <div>
      <input type="file" onChange={checkGifUpload} />
    </div>
  );
}

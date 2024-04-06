// ImageGallery.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Display({ id }) {
  const [images, setImages] = useState([]);

  useEffect(() => {
    async function fetchImages() {
      try {
        const response = await axios.get(`http://localhost:4000/images/${id}`);
        const blobImages = response.data.images.map(imageData => {
          const arrayBuffer = new Uint8Array(imageData.data).buffer;
          return URL.createObjectURL(new Blob([arrayBuffer], { type: 'image/png' }));
        });
        setImages(blobImages);
      } catch (error) {
        console.error('Error fetching images:', error);
      }
    }

    fetchImages();
  }, [id]);

  return (
    <div className="image-gallery">
      {images.map((imageUrl, index) => (
        <img
          key={index}
          src={imageUrl}
          alt={`Image ${index}`}
        />
       
      ))}

    </div>
  );
}

export default Display;

import React, { useState, useEffect } from 'react';

function ImageDisplay({ imageId }) {
  const [imageSrc, setImageSrc] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const response = await fetch(`http://localhost:8000/image/${imageId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch image');
        }
        const imageData = await response.blob();
        const imageUrl = URL.createObjectURL(imageData);
        setImageSrc(imageUrl);
        console.log(imageUrl);
      } catch (error) {
        console.error('Error fetching image:', error);
        setError('Failed to fetch image');
      }
    };

    fetchImage();
  }, [imageId]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      {imageSrc && <img src={imageSrc} alt="Image" />}
    </div>
  );
}

export default ImageDisplay;

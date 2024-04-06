import React, { useState, useEffect } from 'react';

function LabourDetails({ labourId }) {
  const [labour, setLabour] = useState(null);
  const [error, setError] = useState(null);
  const [images, setImages] = useState([]);
  const [imageSrc, setImageSrc] = useState('');
  useEffect(() => {
    const fetchLabourData = async () => {
      try {
        const response = await fetch(`http://localhost:8000/getlabours/${labourId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch labour data');
        }
        const labourData = await response.json();
        console.log(labourData);
        setLabour(labourData);
        const blobImages = labourData.projects.map(imageData => {
            const arrayBuffer = new Uint8Array(imageData.data).buffer;
            return URL.createObjectURL(new Blob([arrayBuffer], { type: 'image/png' }));
          });
          console.log(blobImages);
          setImages(blobImages);
          const imageData = labourData.profile_pic;
           imageData = await imageData.blob();
          const imageUrl = URL.createObjectURL(imageData);
          setImageSrc(imageUrl);
      } catch (error) {
        console.error('Error fetching labour data:', error);
        setError('Failed to fetch labour data');
      }
    };

    fetchLabourData();
  }, [labourId]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!labour) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Labour Details</h2>
      <p>ID: {labour.id}</p>
      <p>Name: {labour.name}</p>
      <p>Description: {labour.description}</p>
      <p>Phone Number: {labour.phone_number}</p>
      <p>Email: {labour.email}</p>
      {imageSrc && <img src={imageSrc} alt="Image" />}
      <div className="image-gallery">
      {images.map((imageUrl, index) => (
        <img
          key={index}
          src={imageUrl}
          alt={`Image ${index}`}
        />
       
      ))}

    </div>
    </div>
  );
}

export default LabourDetails;

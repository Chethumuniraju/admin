import React, { useState } from 'react';
import axios from 'axios';

const AddBuilding= () => {
  const [images, setImages] = useState([]);
  const [description, setDescription] = useState('');
  const [pincode, setPincode] = useState('');
  const [location, setLocation] = useState('');

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files); // Convert FileList to array
    setImages(files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('description', description);
    formData.append('pincode', pincode);
    formData.append('location', location);
    images.forEach((image) => {
      formData.append('images', image);
    });

    try {
      await axios.post('http://localhost:4000/uploadbuilding', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      alert("Added successfully\n");
    } catch (error) {
      console.error('Error uploading images:', error);
    }
  };

  return (
    <div>
      <h1>ADD building info  INFO</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
        <input type="text" placeholder="Pincode" value={pincode} onChange={(e) => setPincode(e.target.value)} />
        <input type="text" placeholder="Location" value={description} onChange={(e) => setLocation(e.target.value)} />
        <input type="file" multiple onChange={handleImageChange} />
        <button type="submit">Upload</button>
      </form>
    </div>
  );
};

export default AddBuilding;

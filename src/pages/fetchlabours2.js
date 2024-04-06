import React, { useState } from 'react';
import axios from 'axios';

const Addlabour= () => {
  const [images, setImages] = useState([]);
  const [description, setDescription] = useState('');
  const [cityId,setCityId ] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [phone_number, setphone_number] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files); // Convert FileList to array
    setImages(files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('description', description);
    formData.append('city_id', cityId);
    formData.append('category_id', categoryId);
    formData.append('name', name);
    formData.append('phone_number', phone_number);
    formData.append('email', email);
    
    images.forEach((image) => {
      formData.append('images', image);
    });

    try {
      await axios.post('http://localhost:4000/uploadlabour', formData, {
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
      <h1>ADD LabourInfo</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
        <input type="text" placeholder="name" value={name} onChange={(e) => setName(e.target.value)} />
        <input type="file" multiple onChange={handleImageChange} />
        <button type="submit">Upload</button>
        <label>
          Phone Number:
          <input type="text" name="phoneNumber"  value={phone_number}  onChange={(e) => setphone_number(e.target.value)}required />
        </label>
        <br />
        <label>
          Email:
          <input type="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)}required />
        </label>
        <label>
          City ID:
          <input type="number" name="cityId" value={cityId} onChange={(e) => setCityId(e.target.value)} required />
        </label>
        <br />
        <label>
          Category ID:
          <input type="number" name="categoryId" value={categoryId} onChange={(e) => setCategoryId(e.target.value)} required />
        </label>
      </form>
    </div>
  );
};

export default Addlabour;

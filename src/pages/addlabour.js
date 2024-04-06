// LaborerForm.js

import React, { useState } from 'react';
import axios from 'axios';

function LaborerForm() {
  const [formData, setFormData] = useState({
    profilePic: null,
    name: '',
    description: '',
    phoneNumber: '',
    email: '',
    projects: [],
    cityId: '',
    categoryId: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleProfilePicChange = (e) => {
    setFormData({ ...formData, profilePic: e.target.files[0] });
  };

  const handleProjectPicsChange = (e) => {
    setFormData({ ...formData, projects: [...e.target.files] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Parse cityId and categoryId as integers
    const cityIdInt = parseInt(formData.cityId);
    const categoryIdInt = parseInt(formData.categoryId);

    const formDataToSend = new FormData();
    formDataToSend.append('profilePic', formData.profilePic);
    formDataToSend.append('name', formData.name);
    formDataToSend.append('description', formData.description);
    formDataToSend.append('phoneNumber', formData.phoneNumber);
    formDataToSend.append('email', formData.email);
    formData.projects.forEach((project) => {
      formDataToSend.append('projects', project);
    });
    formDataToSend.append('cityId', cityIdInt); // Use parsed integer value
    formDataToSend.append('categoryId', categoryIdInt); // Use parsed integer value
console.log(formDataToSend);
    try {
      await axios.post('http://localhost:8000/uploadlabors', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log('Laborer added successfully!');
    } catch (error) {
      console.error('Error adding laborer:', error);
    }
  };

  return (
    <div>
      <h2>Add New Laborer</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Profile Picture:
          <input type="file" accept="image/*" onChange={handleProfilePicChange} required />
        </label>
        <br />
        <label>
          Name:
          <input type="text" name="name" value={formData.name} onChange={handleChange} required />
        </label>
        <br />
        <label>
          Description:
          <textarea name="description" value={formData.description} onChange={handleChange} required />
        </label>
        <br />
        <label>
          Phone Number:
          <input type="text" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} required />
        </label>
        <br />
        <label>
          Email:
          <input type="email" name="email" value={formData.email} onChange={handleChange} required />
        </label>
        <br />
        <label>
          Project Pictures:
          <input type="file" accept="image/*" multiple onChange={handleProjectPicsChange} required />
        </label>
        <br />
        <label>
          City ID:
          <input type="number" name="cityId" value={formData.cityId} onChange={handleChange} required />
        </label>
        <br />
        <label>
          Category ID:
          <input type="number" name="categoryId" value={formData.categoryId} onChange={handleChange} required />
        </label>
        <br />
        <button type="submit">Add Laborer</button>
      </form>
    </div>
  );
}

export default LaborerForm;

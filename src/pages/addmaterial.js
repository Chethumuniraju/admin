import React, { useState } from 'react';
import axios from 'axios';

function MaterialForm() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    companyName: '',
    cityId: '',
    categoryId:'',
    image: null,
    price: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    formDataToSend.append('name', formData.name);
    formDataToSend.append('description', formData.description);
    formDataToSend.append('companyName', formData.companyName);
    formDataToSend.append('cityId', formData.cityId);
    formDataToSend.append('categoryId', formData.categoryId);
    formDataToSend.append('image', formData.image);
    formDataToSend.append('price', formData.price);
    console.log(formData);
    try {
      const response = await axios.post('http://localhost:8000/uploadmaterial', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log('Material added successfully:', response.data);
      // Add logic to handle success, such as showing a success message to the user
    } catch (error) {
      console.error('Error adding material:', error);
      // Add logic to handle error, such as showing an error message to the user
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Name" />
      <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Description"></textarea>
      <input type="text" name="companyName" value={formData.companyName} onChange={handleChange} placeholder="Company Name" />
      <input type="number" name="cityId" value={formData.cityId} onChange={handleChange} placeholder="City ID" />
      <input type="number" name="categoryId" value={formData.categoryId} onChange={handleChange} placeholder="Category ID" />
      <input type="file" name="image" onChange={handleFileChange} />
      <input type="text" name="price" value={formData.price} onChange={handleChange} placeholder="Price" />
      <button type="submit">Submit</button>
    </form>
  );
}

export default MaterialForm;

import React, { useState } from 'react';
import axios from 'axios';

function Addcity() {
  const [formData, setFormData] = useState({
    description: '',
    pincode: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/uploadcity', formData);
      console.log(response.data); // Handle success
    } catch (error) {
      console.error('Error adding building:', error); // Handle error
    }
  };

  return (
    <div>
      <h2>Add Building</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="description">Description:</label>
          <input
            type="text"
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="pincode">Pincode:</label>
          <input
            type="text"
            id="pincode"
            name="pincode"
            value={formData.pincode}
            onChange={handleChange}
          />
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default Addcity;

const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 4000;
const cors = require('cors');
app.use(cors());
// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = './uploads';
    fs.mkdirSync(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// PostgreSQL setup
const { Pool } = require('pg');
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'gharsati',
  password: 'Chethan@1330',
  port: 5000,
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Handle image upload
app.post('/uploadsite', upload.array('images'), async (req, res) => {
  try {
    
    const { description, pincode,location } = req.body;
    const images = req.files.map(file => fs.readFileSync(file.path));
    const response = await fetch(`https://api.geoapify.com/v1/geocode/autocomplete?text=${pincode}&format=json&apiKey=65742e5871d448fbb4bc4ebd1e059bb7
    `);// Replace 'https://example.com/pincode/' with actual API endpoint
    if (!response.ok) {
      throw new Error('Failed to fetch location data from pin code API');
    }
    const pincodeData = await response.json();
    // Extract longitude and latitude from pin code API response
    const { lon, lat } = pincodeData.results[0];

    // Insert data into PostgreSQL database
    const query = 'INSERT INTO site (description, pincode, images,latitude, longitude,location) VALUES ($1, $2, $3,$4,$5,$6)';
    await pool.query(query, [description, pincode, images,lat,lon,location]);

    // Cleanup uploaded files
    req.files.forEach(file => fs.unlinkSync(file.path));

    res.status(200).send('Images uploaded successfully.');
  } catch (error) {
    console.error('Error uploading images:', error);
    res.status(500).send('Error uploading images.');
  }
});

// Fetch images from the database
// Existing code...
app.post('/uploadbuilding', upload.array('images'), async (req, res) => {
  try {
    
    const { description, pincode } = req.body;
    const images = req.files.map(file => fs.readFileSync(file.path));
    const response = await fetch(`https://api.geoapify.com/v1/geocode/autocomplete?text=${pincode}&format=json&apiKey=65742e5871d448fbb4bc4ebd1e059bb7
    `);// Replace 'https://example.com/pincode/' with actual API endpoint
    if (!response.ok) {
      throw new Error('Failed to fetch location data from pin code API');
    }
    const pincodeData = await response.json();
    // Extract longitude and latitude from pin code API response
    const { lon, lat } = pincodeData.results[0];

    // Insert data into PostgreSQL database
    const query = 'INSERT INTO building (description, pincode, images,latitude, longitude) VALUES ($1, $2, $3,$4,$5)';
    await pool.query(query, [description, pincode, images,lat,lon]);

    // Cleanup uploaded files
    req.files.forEach(file => fs.unlinkSync(file.path));

    res.status(200).send('Images uploaded successfully.');
  } catch (error) {
    console.error('Error uploading images:', error);
    res.status(500).send('Error uploading images.');
  }
});
// Fetch images from the database by ID
app.get('/images/:id', async (req, res) => {
  const id = req.params.id;

  try {
    const query = {
      text: 'SELECT * FROM labours WHERE id = $1',
      values: [id],
    };
    const result = await pool.query(query);
    console.log(result);
    const imageData = result.rows[0].projects; // Assuming each row has a single image, adjust if 
    console.log(imageData);
    res.json({ images: imageData });
  } catch (error) {
    console.error('Error fetching image:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
app.post('/uploadlabour', upload.array('images'), async (req, res) => {
  try {
      const { description, city_id, category_id, name, phone_number, email } = req.body;
      const images = req.files.map(file => fs.readFileSync(file.path));
   
      const query = 'INSERT INTO labours (description, projects, name, city_id, category_id, phone_number, email) VALUES ($1, $2, $3, $4, $5, $6, $7)';
      await pool.query(query, [description, images, name, city_id, category_id, phone_number, email]);

      // Cleanup uploaded files
      req.files.forEach(file => fs.unlinkSync(file.path));

      res.status(200).send('Data uploaded successfully.');
  } catch (error) {
      console.error('Error uploading data:', error);
      res.status(500).send('Error uploading data.');
  }
});

// Existing code...


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

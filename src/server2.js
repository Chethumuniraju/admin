const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 8000;
const cors = require('cors');
app.use(cors());
// Multer storage configuration
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     const uploadDir = './uploads';
//     fs.mkdirSync(uploadDir, { recursive: true });
//     cb(null, uploadDir);
//   },
//   filename: (req, file, cb) => {
//     cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
//   }
// });
const storage = multer.memoryStorage();
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
// app.use(express.urlencoded({ extended: true }));

// Handle image upload


// Fetch images from the database
// Existing code...
app.post('/uploadcity', async (req, res) => {
    console.log("Here\n");
    try {
      
      const { description, pincode } = req.body;
     
      const response = await fetch(`https://api.geoapify.com/v1/geocode/autocomplete?text=${pincode}&format=json&apiKey=65742e5871d448fbb4bc4ebd1e059bb7
      `);// Replace 'https://example.com/pincode/' with actual API endpoint
      if (!response.ok) {
        throw new Error('Failed to fetch location data from pin code API');
      }
      const pincodeData = await response.json();
      
      const { lon, lat } = pincodeData.results[0];
  
      // Insert data into PostgreSQL database
      const query = 'INSERT INTO city (description, pincode ,latitude, longitude) VALUES ($1, $2, $3,$4)';
      await pool.query(query, [description, pincode,lat,lon]);
  
      // Cleanup uploaded files
      
  
      res.status(200).send('City  uploaded successfully.');
    } catch (error) {
      console.error('Error uploading city:', error);
      res.status(500).send('Error uploading city.');
    }
  });
  app.post('/uploadmaterial',upload.single('image'), async (req, res) => {
    try {
        console.log(req.file);
      const { name, description, companyName, cityId, categoryId, price } = req.body;
      const imageData = req.file.buffer;
    const query = `
        INSERT INTO material (name, description, company_name, city_id,category_id, price, image)
        VALUES ($1, $2, $3, $4, $5, $6,$7)
        RETURNING id`;
  
      const result = await pool.query(query, [name, description, companyName, cityId,categoryId, price, imageData]);
      const newMaterialId = result.rows[0].id;
  
      res.status(201).json({ success: true, id: newMaterialId });
    } catch (error) {
      console.error('Error registering material:', error);
      res.status(500).json({ success: false, error: 'Error registering material' });
    }
  });
  app.get('/image/:id', async (req, res) => {
    const { id } = req.params;

    try {
      const client = await pool.connect();
      const result = await client.query('SELECT image FROM material WHERE id = $1', [id]);
      client.release();
  
      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Image not found' });
      }
  
      const imageData = result.rows[0].image;
      
      res.send(imageData);
    } catch (error) {
      console.error('Error fetching image:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  app.post('/uploadlabour', upload.array('images'), async (req, res) => {
    try {
      
      const { description, city_id,category_id,name,phone_number,email } = req.body;
      const images = req.files.map(file => fs.readFileSync(file.path));
     
      const query = 'INSERT INTO labours (description,  projects,name,city_id,category_id,phone_number,email VALUES ($1, $2, $3,$4,$5,$6,$7)';
      await pool.query(query, [description, images,name,city_id,category_id,phone_number,email]);
  
      // Cleanup uploaded files
      req.files.forEach(file => fs.unlinkSync(file.path));
  
      res.status(200).send('Images uploaded successfully.');
    } catch (error) {
      console.error('Error uploading images:', error);
      res.status(500).send('Error uploading images.');
    }
  });
  
  
  app.get('/getlabours/:id', async (req, res) => {
    const labourId = req.params.id;
  
    try {
      const client = await pool.connect();
      const query = 'SELECT * FROM labours WHERE id = $1';
      const result = await client.query(query, [labourId]);
      client.release();
  
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Labour not found' });
      }
  
      const labour = result.rows[0];
      res.json(labour);
    } catch (error) {
      console.error('Error fetching labour data:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

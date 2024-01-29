const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');


const profile1Routes = require('./routes/profile1Routes');
const profile2Routes = require('./routes/profile2Routes')
const profile3Routes = require('./routes/profile3Routes')
const profile4Routes = require('./routes/profile4Routes')
const profile5Routes = require('./routes/profile5Routes')
const profile6Routes = require('./routes/profile6Routes')
const profile7Routes = require('./routes/profile7Routes')




app.use(express.json());
app.use(cors());
// Middleware to parse JSON bodies
app.use(bodyParser.json());


mongoose.connect('mongodb+srv://greeneats:nsbm2023@cluster0.dpgxkwe.mongodb.net/greeneats?retryWrites=true&w=majority')
  .then(() => {
    console.log('Connected to MongoDB Atlas');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB Atlas:', error);
  });

  app.use('/profile1',profile1Routes)
  app.use('/profile2',profile2Routes)
  app.use('/profile3',profile3Routes)
  app.use('/profile4',profile4Routes)
  app.use('/profile5',profile5Routes)
  app.use('/profile6',profile6Routes)
  app.use('/profile7',profile7Routes)
  
  

app.listen(3001, () => {
  console.log('Server is running');
})

const express = require('express');
const router = express.Router();
const Profile1Model = require('../models/Profile1/Profile1Model');
const SelectedMenu1Model =require('../models/Profile1/SelectedMenu1')
const { User , validate } = require("../models/Profile1/User1");
const bcrypt = require("bcrypt");
const Joi = require("joi");
const Order = require('../models/Profile1/order1');
const admin = require('firebase-admin');
//crud funtions



//crud funtions

router.post('/notify-flutter', (req, res) => {
  const message = {
    data: {
      status: 'received'
    },
    // Use the FCM token of the Flutter app instance here
    token: 'fQgtH8WGS7e7z33QsNVINf:APA91bEp1FKAKCYZKG2ZedNv1M7fXpauejx9HD76eicyUMeuSglpxYTD1m0NxozapvRyDVLO4Pj4diIgqbt7bdCYO0EcHBRLzyjQtV5q-kdHoWXtOZSuHq5B0jYp_Lux5V9KrPzXxb42',
  };

  admin.messaging().send(message)
    .then((response) => {
      console.log('Successfully sent message:', response);
      res.status(200).send('Notification sent successfully');
    })
    .catch((error) => {
      console.log('Error sending message:', error);
      res.status(500).send('Error sending notification');
    });
});

router.get('/', (req, res) => {
  Profile1Model.find({})
    .then(data => res.json(data))
    .catch(err => res.status(500).json({ error: err.message }));
});

router.get('/get/:id', (req, res) => {
  const id = req.params.id;
  Profile1Model.findById(id)
    .then(data => {
      if (!data) {
        return res.status(404).json({ message: 'Item not found' });
      }
      res.json(data);
    })
    .catch(err => res.status(500).json({ error: err.message }));
});

router.post('/create', (req, res) => {
  const { name, description, price, imgUrl } = req.body;
  Profile1Model.create({ name, description, price, imgUrl })
    .then(data => res.status(201).json(data))
    .catch(err => res.status(400).json({ error: err.message }));
});

router.put('/update/:id', (req, res)=> {
  const id = req.params.id;
  Profile1Model.findByIdAndUpdate({_id:id},{name:req.body.name, description:req.body.description, price:req.body.price, imgUrl:req.body.imgUrl})
  .then(foods => res.json(foods))
  .catch(err => res.status(500).json({ error: err.message }))
})

router.delete('/delete/:id',(req,res) => {
  const id = req.params.id;
  Profile1Model.findOneAndDelete({_id:id})
  .then(res => res.json(res))
  .catch(err => res.json(err))
}) 

//selected food menu

router.post('/saveSelectedFood', (req, res) => {
  const { name, description, price, imgUrl } = req.body;

  // Assuming SelectedFoodModel is defined similarly to FoodModel
  SelectedMenu1Model.create({ name, description, price, imgUrl })
    .then((selectedFood) => {
      
      res.status(201).json(selectedFood);
    })
    .catch((err) => {
      console.error('Error saving selected item:', err);
      res.status(500).json({ error: err.message });
    });
});

router.delete('/deleteSelectedFood/:id', (req, res) => {
  const id = req.params.id;

  SelectedMenu1Model.findByIdAndDelete(id)
    .then(deletedItem => {
      if (!deletedItem) {
        return res.status(404).json({ error: 'Item not found or already deleted' });
      }
      res.json({ message: 'Selected item successfully deleted', deletedItem });
    })
    .catch(err => {
      console.error('Error deleting selected item:', err);
      res.status(500).json({ error: 'Could not delete the selected item', details: err.message });
    });
});


router.delete('/clearTable', (req, res) => {
  SelectedMenu1Model.deleteMany() // You missed the parentheses here
    .then(deletedItems => {
      res.json({ message: 'SelectedFood collection cleared', deletedItems });
    })
    .catch(err => {
      res.status(500).json({ error: 'Could not clear the SelectedFood collection', details: err.message });
    });
});




router.post('/orders', async (req, res) => {
  try {
    const { items, price, name, phone, id } = req.body;

    // Create a new order instance
    const newOrder = new Order({
      items,price,name,phone,id
    });

    // Save the order to the database
    await newOrder.save();

    // Send a response back to the Flutter app
    res.status(200).json({ status: 'received' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'error' });
  }
});

router.get('/orderres', (req, res) => {
  Order.find({})
    .then(data => res.json(data))
    .catch(err => res.status(500).json({ error: err.message }));
});



// Login route
router.post("/api/auth", async (req, res) => {
  try {
      // Login validation
      const loginSchema = Joi.object({
          email: Joi.string().email().required().label("Email"),
          password: Joi.string().required().label("Password"),
      });

      const { error } = loginSchema.validate(req.body);
      if (error) {
          return res.status(400).send({ message: error.details[0].message });
      }

      const user = await User.findOne({ email: req.body.email });
      if (!user) {
          return res.status(401).send({ message: "Invalid Email or Password" });
      }

      const validPassword = await bcrypt.compare(req.body.password, user.password);
      if (!validPassword) {
          return res.status(401).send({ message: "Invalid Email or Password" });
      }

      const token = user.generateAuthToken();
      res.status(200).send({ data: token, message: "Logged in successfully" });
  } catch (error) {
      console.error("Error:", error);
      res.status(500).send({ message: "Internal Server Error" });
  }
});


// Signup route

let signedUpUserCount = 0;
const signupLimit = 1;

router.post("/api/users", async (req, res) => {
    try {
        if (signedUpUserCount >= signupLimit) {
            return res.status(400).send({ message: "You have no permission to sign up. Please contact the administrator." });
        }

        const { error } = validate(req.body);
        if (error) {
            return res.status(400).send({ message: error.details[0].message });
        }

        const existingUser = await User.findOne({ email: req.body.email });
        if (existingUser) {
            return res.status(409).send({ message: "User with given email already exists." });
        }

        const saltRounds = 10; // Replace 10 with your desired number of salt rounds

        // Generate the salt
        const salt = await bcrypt.genSalt(saltRounds);
        
        // Hash the password with the generated salt
        const hashPassword = await bcrypt.hash(req.body.password, salt);
        

        await new User({ ...req.body, password: hashPassword }).save();

        signedUpUserCount++;

        res.status(201).send({ message: "User created successfully" });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send({ message: "Internal Server Error" });
    }
});




module.exports = router;


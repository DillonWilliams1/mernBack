const express = require('express');
const router = express.Router();
const Profile6Model = require('../models/Profile6/Profile6Model');
const SelectedMenu6Model =require('../models/Profile6/SelectedMenu6')
const { User , validate } = require("../models/Profile6/User6");
const bcrypt = require("bcrypt");
const Joi = require("joi");
const Order = require('../models/Profile6/Order6');
const Orderhistory = require('../models/Profile6/Orderhistory6');
const admin = require('firebase-admin');

router.get('/', (req, res) => {
  Profile6Model.find({})
    .then(data => res.json(data))
    .catch(err => res.status(500).json({ error: err.message }));
});

router.get('/get/:id', (req, res) => {
  const id = req.params.id;
  Profile6Model.findById(id)
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
  Profile6Model.create({ name, description, price, imgUrl })
    .then(data => res.status(201).json(data))
    .catch(err => res.status(400).json({ error: err.message }));
});

router.put('/update/:id', (req, res)=> {
  const id = req.params.id;
  Profile6Model.findByIdAndUpdate({_id:id},{name:req.body.name, description:req.body.description, price:req.body.price, imgUrl:req.body.imgUrl})
  .then(foods => res.json(foods))
  .catch(err => res.status(500).json({ error: err.message }))
})

router.delete('/delete/:id',(req,res) => {
  const id = req.params.id;
  Profile6Model.findOneAndDelete({_id:id})
  .then(res => res.json(res))
  .catch(err => res.json(err))
}) 


router.post('/saveSelectedFood', (req, res) => {
  const { name, description, price, imgUrl } = req.body;

  // Assuming SelectedFoodModel is defined similarly to FoodModel
  SelectedMenu6Model.create({ name, description, price, imgUrl })
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

  SelectedMenu6Model.findByIdAndDelete(id)
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
  SelectedMenu6Model.deleteMany() // You missed the parentheses here
    .then(deletedItems => {
      res.json({ message: 'SelectedFood collection cleared', deletedItems });
    })
    .catch(err => {
      res.status(500).json({ error: 'Could not clear the SelectedFood collection', details: err.message });
    });
});

router.post('/orders', async (req, res) => {
  try {
    const { items, price, name, phone, id, token } = req.body;

    // Create a new order instance
    const newOrder = new Order({
      items,price,name,phone,id,token
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


router.post('/Orderhistory', async (req, res) => {
  try {
    const { orderId } = req.body;

    // Find the order by ID
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).send('Order not found');
    }

    // Create a new accepted order entry
    const  orderhistory= new Orderhistory({
      orderId: order._id,
      timestamp: Date.now(),
      items: order.items,
      price: order.price,
      name: order.name,
      phone: order.phone,
      id: order.id,
      // Add any additional fields you want to store for accepted orders
    });


    await orderhistory.save();

    // Optionally, you can remove the accepted order from the original orders table
    await Order.findByIdAndDelete(orderId);

    res.status(200).send('Order accepted and stored in another table');
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

// Add this route to handle deleting orders
router.delete('/orderres/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;

    // Remove the order from the Order table based on the orderId
    await Order.findByIdAndDelete(orderId);

    res.status(200).send('Order rejected and removed from the table');
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});


router.get('/orderhistorytable', (req, res) => {
  Orderhistory.find({})
    .then(data => res.json(data))
    .catch(err => res.status(500).json({ error: err.message }));
});

router.post('/accept' , async (req, res) => {
  try {
   
    const { orderId } = req.body;

    const order = await Order.findById(orderId);

    const token = order.token;

    // Use the FCM token from the retrieved data
    const message = {
      data: {
        status: 'received'
      },
      token: token,
    };

    // Send the FCM message
    const response = await admin.messaging().send(message);

    console.log('Successfully sent message:', response);
    res.status(200).send('Notification sent successfully');
  } catch (error) {
    console.error('Error sending notification:', error);
    res.status(500).send('Error sending notification');
  }
});

router.post('/reject' , async (req, res) => {
  try {
   
    const { orderId } = req.body;

    const order = await Order.findById(orderId);

    const token = order.token;

    // Use the FCM token from the retrieved data
    const message = {
      data: {
        status: 'rejected'
      },
      token: token,
    };

    // Send the FCM message
    const response = await admin.messaging().send(message);

    console.log('Successfully sent message:', response);
    res.status(200).send('Notification sent successfully');
  } catch (error) {
    console.error('Error sending notification:', error);
    res.status(500).send('Error sending notification');
  }
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


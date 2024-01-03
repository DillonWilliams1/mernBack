const express = require('express');
const router = express.Router();
const Profile4Model = require('../models/Profile4/Profile4Model');
const SelectedMenu4Model =require('../models/Profile4/SelectedMenu4')
const { User , validate } = require("../models/Profile4/User4");
const bcrypt = require("bcrypt");
const Joi = require("joi");

router.get('/', (req, res) => {
  Profile4Model.find({})
    .then(data => res.json(data))
    .catch(err => res.status(500).json({ error: err.message }));
});

router.get('/get/:id', (req, res) => {
  const id = req.params.id;
  Profile4Model.findById(id)
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
  Profile4Model.create({ name, description, price, imgUrl })
    .then(data => res.status(201).json(data))
    .catch(err => res.status(400).json({ error: err.message }));
});

router.put('/update/:id', (req, res)=> {
  const id = req.params.id;
  Profile4Model.findByIdAndUpdate({_id:id},{name:req.body.name, description:req.body.description, price:req.body.price, imgUrl:req.body.imgUrl})
  .then(foods => res.json(foods))
  .catch(err => res.status(500).json({ error: err.message }))
})

router.delete('/delete/:id',(req,res) => {
  const id = req.params.id;
  Profile4Model.findOneAndDelete({_id:id})
  .then(res => res.json(res))
  .catch(err => res.json(err))
}) 


router.post('/saveSelectedFood', (req, res) => {
  const { name, description, price, imgUrl } = req.body;

  // Assuming SelectedFoodModel is defined similarly to FoodModel
  SelectedMenu4Model.create({ name, description, price, imgUrl })
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

  SelectedMenu4Model.findByIdAndDelete(id)
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
  SelectedMenu4Model.deleteMany() // You missed the parentheses here
    .then(deletedItems => {
      res.json({ message: 'SelectedFood collection cleared', deletedItems });
    })
    .catch(err => {
      res.status(500).json({ error: 'Could not clear the SelectedFood collection', details: err.message });
    });
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


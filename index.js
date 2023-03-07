const express = require('express');
const mongoose = require('mongoose');

// connect to MongoDB database
mongoose.connect('mongodb://localhost/my-inventory-db', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// define schema for inventory collection
const inventorySchema = new mongoose.Schema({
  productId: Number,
  quantity: Number,
});

// define model for inventory collection
const Inventory = mongoose.model('Inventory', inventorySchema);

// create Express app
const app = express();

// set up middleware to handle JSON requests
app.use(express.json());

// route to handle POST requests 
app.post('/api/inventory', async (req, res) => {
  const { payload } = req.body;
  try {
    for (const { productId, quantity, operation } of payload) {
      const inventory = await Inventory.findOne({ productId });

      if (inventory) {
        if (operation === 'add') {
          inventory.quantity += quantity;
        } else if (operation === 'subtract') {
          inventory.quantity -= quantity;
        }

        await inventory.save();
      }
    }

    res.sendStatus(200);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});
app.listen(3000, () => {
  console.log('Server listening on port 3000');
});

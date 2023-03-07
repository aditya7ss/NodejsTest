const express = require('express');
const router = express.Router();
const Inventory = require('../models/inventory');

const MongoStore = require('connect-mongo');
//to connect th mongodb

mongoose.connect('mongodb://localhost/my-inventory-db', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});


// POST /api/products
router.get('/',(res,req)=>{
    res.Json({message:'its working'})
})

router.post('/api/products', async (req, res) => {
  const { payload } = req.body;

  try {
    const promises = payload.map(async ({ productId, quantity, operation }) => {
      const inventory = await Inventory.findOne({ productId });

      if (inventory) {
        if (operation === 'add') {
          inventory.quantity += quantity;
        } else if (operation === 'subtract') {
          inventory.quantity -= quantity;
        }
        await inventory.save();
      } else {
        if (operation === 'add') {
          await Inventory.create({ productId, quantity });
        }
      }
    });

    await Promise.all(promises);

    res.status(200).send('Inventory updated successfully');
  } catch (err) {
    console.error('Error updating inventory:', err);
    res.status(500).send('Error updating inventory');
  }
});

module.exports = router;

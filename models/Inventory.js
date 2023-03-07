const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
  productId: {
    type: Number,
    required: true,
    unique: true
  },
  quantity: {
    type: Number,
    required: true
  }
});

const Inventory = mongoose.model('Inventory', inventorySchema);

module.exports = Inventory;

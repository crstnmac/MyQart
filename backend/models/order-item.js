const mongoose = require('mongoose')

/* This is the schema for the Order model. */
const orderItemSchema = mongoose.Schema({
  quantity: { type: Number, required: true },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
})

/* This is creating a model called `Order` that is using the `orderSchema` schema. */
exports.OrderItem = mongoose.model('OrderItem', orderItemSchema)

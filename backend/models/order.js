const mongoose = require('mongoose')

/* This is the schema for the Order model. */
const orderSchema = mongoose.Schema({
  name: String,
  image: String,
  countInStock: { type: Number, required: true },
})

/* This is creating a model called `Order` that is using the `orderSchema` schema. */
exports.Order = mongoose.model('Order', orderSchema)

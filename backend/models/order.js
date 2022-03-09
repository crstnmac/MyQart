const mongoose = require('mongoose')

/* This is the schema for the Order model. */
const orderSchema = mongoose.Schema({
  orderItems: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'OrderItem',
      required: true,
    },
  ],
  shippingAddress1: { type: String, required: true },
  shippingAddress2: { type: String },
  shippingCity: { type: String, required: true },
  shippingState: { type: String, required: true },
  shippingZip: { type: String, required: true },
  shippingCountry: { type: String, required: true },
  phone: { type: String, required: true },
  status: { type: String, required: true, default: 'pending' },
  totalPrice: { type: Number, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  dateCreated: { type: Date, default: Date.now },
})

/* This is a virtual field that will be added to the JSON representation of the order. */
orderSchema.virtual('id').get(function () {
  return this._id.toHexString()
})

/* This is telling mongoose to include virtual fields in the JSON representation of the order. */
orderSchema.set('toJSON', {
  virtuals: true,
})

/* This is creating a model called `Order` that is using the `orderSchema` schema. */
exports.Order = mongoose.model('Order', orderSchema)

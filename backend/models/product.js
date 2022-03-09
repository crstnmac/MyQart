const mongoose = require('mongoose')

/* This is a schema for a product. */
const productSchema = mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  richDescription: { type: String, default: '' },
  image: { type: String, default: '' },
  images: [{ type: String }],
  brand: { type: String, default: '' },
  price: { type: Number, default: 0 },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },
  countInStock: { type: Number, required: true, min: 0, max: 255 },
  rating: { type: Number, default: 0 },
  numReviews: { type: Number, default: 0 },
  isFeatured: { type: Boolean, default: false },
  dateCreated: { type: Date, default: Date.now },
})

/* This is a virtual field that will be added to the JSON representation of the product. */
productSchema.virtual('id').get(function () {
  return this._id.toHexString()
})

/* This is telling mongoose to include virtual fields in the JSON representation of the product. */
productSchema.set('toJSON', {
  virtuals: true,
})

exports.Product = mongoose.model('Product', productSchema)

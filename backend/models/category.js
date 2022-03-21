const mongoose = require('mongoose')

/* This is defining a new schema for the `Category` model. */
const categorySchema = mongoose.Schema({
  name: { type: String, required: true },
  color: { type: String },
  icon: { type: String },
})

categorySchema.virtual('id').get(function () {
  return this._id.toHexString()
})

categorySchema.set('toJSON', {
  virtuals: true,
})

/* This is creating a new model called `Category` that uses the `categorySchema` schema. */
exports.Category = mongoose.model('Category', categorySchema)

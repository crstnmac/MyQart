const { Product } = require('../models/product')
const { Category } = require('../models/category')
const express = require('express')
const router = express.Router()

const mongoose = require('mongoose')
const multer = require('multer')
const e = require('express')

const FILE_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const isValid = FILE_TYPE_MAP[file.mimetype]
    let uploadError = new Error('Invalid Image type')

    if (isValid) {
      uploadError = null
    }
    cb(uploadError, 'public/images/products')
  },
  filename: function (req, file, cb) {
    const fileName = file.originalname.split(' ').join('-')
    const extension = FILE_TYPE_MAP[file.mimetype]
    cb(null, `${fileName}-${Date.now()}.${extension}`)
  },
})

const uploadOptions = multer({ storage })

/* This is the route for getting all the products. */
router.get(`/`, async (req, res) => {
  let filter = {}
  if (req.query.categories) {
    filter = { category: req.query.categories.split(',') }
  }

  const productList = await Product.find(filter).populate('category')
  if (!productList) {
    res.status(500).json({ success: false })
  }
  res.send(productList)
})

/* This is the route for getting a single product. */
router.get(`/:id`, async (req, res) => {
  const product = await Product.findById(req.params.id).populate('category')
  if (!product) {
    res.status(500).json({ success: false })
  }
  res.send(product)
})

/* Creating a new product. */
router.post(`/`, uploadOptions.single('image'), async (req, res) => {
  const category = await Category.findById(req.body.category)

  if (!category) return res.status(400).send('the category cannot be found!')

  const file = req.file
  if (!file) return res.status(400).send('the file cannot be found!')

  const fileName = req.file.filename
  const basePath = `${req.protocol}://${req.get(
    'host'
  )}/public/images/products/`
  let product = new Product({
    name: req.body.name,
    description: req.body.description,
    richDescription: req.body.richDescription,
    image: `${basePath}${fileName}`,
    brand: req.body.brand,
    price: req.body.price,
    category: req.body.category,
    countInStock: req.body.countInStock,
    rating: req.body.rating,
    numReviews: req.body.numReviews,
    isFeatured: req.body.isFeatured,
  })

  product = await product.save()

  if (!product) return res.status(500).send('the product cannot be created!')

  res.send(product)
})

router.put('/:id', async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(404).send('Invalid Product!')
  }
  const category = await Category.findById(req.body.category)
  if (!category) return res.status(400).send('the category cannot be found!')

  const product = await Product.findById(req.params.id)
  if (!product) return res.status(404).send('Invalid Product!')

  const file = req.file
  let imagePath

  if (file) {
    const fileName = file.filename
    const basePath = `${req.protocol}://${req.get(
      'host'
    )}/public/images/products/`
    imagePath = `${basePath}${fileName}`
  } else {
    imagePath = product.image
  }

  const updatedProduct = await Product.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      description: req.body.description,
      richDescription: req.body.richDescription,
      image: req.body.image,
      brand: req.body.brand,
      price: req.body.price,
      category: req.body.category,
      countInStock: req.body.countInStock,
      rating: req.body.rating,
      numReviews: req.body.numReviews,
      isFeatured: req.body.isFeatured,
    },
    {
      new: true,
    }
  )

  if (!updatedProduct) {
    return res.status(404).send('the product cannot be updated!')
  }

  res.send(updatedProduct)
})

router.delete('/:id', (req, res) => {
  Product.findByIdAndRemove(req.params.id)
    .then((product) => {
      if (product) {
        return res.status(200).json({
          success: true,
          message: 'The product has been deleted!',
        })
      } else {
        return res.status(404).json({
          success: false,
          message: 'The product cannot be found!',
        })
      }
    })
    .catch((err) => {
      return res.status(400).json({
        success: false,
        message: 'The product cannot be deleted!',
      })
    })
})

router.get(`/get/count`, async (req, res) => {
  const productCount = await Product.countDocuments()
  if (!productCount) {
    res.status(500).json({ success: false })
  }
  res.send({ productCount: productCount })
})

router.get(`/get/featured/:count`, async (req, res) => {
  const count = req.params.count ? req.params.count : 0
  const products = await Product.find({ isFeatured: true }).limit(+count)
  if (!products) {
    res.status(500).json({ success: false })
  }
  res.send(products)
})

router.put(
  '/gallery-images/:id',
  uploadOptions.array('images', 10),
  async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(404).send('Invalid Product!')
    }

    const basePath = `${req.protocol}://${req.get(
      'host'
    )}/public/images/products/`
    const files = req.files
    let imagePaths = []

    if (files) {
      files.map((file) => {
        imagePaths.push(`${basePath}${file.fileName}`)
      })
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { images: imagePaths },
      { new: true }
    )

    if (!product) {
      return res.status(404).send('the product cannot be updated!')
    }

    res.send(product)
  }
)

module.exports = router

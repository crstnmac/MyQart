const express = require('express')
const app = express()
require('dotenv').config()
const morgan = require('morgan')
const mongoose = require('mongoose')
const api = process.env.API_URL
const port = process.env.PORT
const cors = require('cors')
const authJwt = require('./helpers/jwt')
const errorHandler = require('./helpers/jwt')

app.use(cors())
app.options('*', cors())

//middleware
app.use(express.json())
app.use(morgan('tiny'))
app.use(authJwt())
app.use(
  '/public/images/products',
  express.static(__dirname + '/public/images/products')
)
app.use(errorHandler())

//Routers
const categoriesRouter = require('./routers/categories')
const ordersRouter = require('./routers/orders')
const productsRouter = require('./routers/products')
const usersRouter = require('./routers/users')

app.use(`${api}/categories`, categoriesRouter)
app.use(`${api}/orders`, ordersRouter)
app.use(`${api}/products`, productsRouter)
app.use(`${api}/users`, usersRouter)

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log('Database connected')
  })
  .catch((err) => {
    console.log(err)
  })

app.listen(port, () => {
  console.log(api)
  console.log(`Server is running on http://localhost:${port}`)
})

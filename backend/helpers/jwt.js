const expressJwt = require('express-jwt')

/**
 * This middleware will allow access to the routes specified in the `unless` property,
 * unless the request is made to the routes specified in the `path` property.
 *
 * The `path` property is an array of objects that specify the route and the HTTP method that the
 * middleware will allow.
 *
 * The `unless` property is an array of objects that specify the route and the HTTP method that the
 * middleware will disallow.
 *
 * The `isRevoked` function is used to check if the JWT token has been revoked.
 *
 * The `userProperty` property is used to specify the property in the request object that will hold the
 * decoded JWT payload.
 *
 * The `secret` property is used to specify the secret key used to decode the JWT token.
 *
 * The `algorithms` property is used to specify the algorithm used to decode the JWT token.
 *
 * The `api
 * @returns An express middleware function.
 */
function authJwt() {
  const secret = process.env.SECRET_KEY
  const api = process.env.API_URL
  return expressJwt({
    secret,
    algorithms: ['HS256'],
    userProperty: 'payload',
    isRevoked: isRevoked,
  }).unless({
    path: [
      { url: /\/api\/v1\/products(.*)/, methods: ['GET', 'OPTIONS'] },
      { url: /\/api\/v1\/categories(.*)/, methods: ['GET', 'OPTIONS'] },
      `${api}/users/login`,
      `${api}/users/register`,
    ],
  })
}

/**
 * If the user is not an admin, then the token is revoked
 * @param req - The request object.
 * @param payload - The payload object that is passed to the authentication function.
 * @param done - A callback function that is called when the verification process is done.
 */
async function isRevoked(req, payload, done) {
  if (!payload.isAdmin) {
    done(null, true)
  }
  done()
}

module.exports = authJwt

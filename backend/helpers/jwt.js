const expressJwt = require('express-jwt')

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
      { url: /\/public\/images\/products(.*)/, methods: ['GET', 'OPTIONS'] },
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

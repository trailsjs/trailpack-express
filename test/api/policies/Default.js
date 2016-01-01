/**
 * @module Default
 * @description Test document Policy
 */
module.exports = {
  intercept: function (req, res, next) {
    res.status(201).json({result: 'intercept'})
  },
  success: function (req, res, next) {
    next()
  },
  fail: function (req, res, next) {
    res.status(500).send('Policy fail')
  }
}

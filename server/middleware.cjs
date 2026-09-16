// Deterministic failure injection for the demo/tests.
// Append `?forceError=true` to any json-server request to get a 500 response
// so the app's error state + retry flow can be demonstrated on demand.
module.exports = (req, res, next) => {
  if (req.query.forceError === 'true') {
    return res.status(500).jsonp({ error: 'Simulated server error' })
  }
  next()
}

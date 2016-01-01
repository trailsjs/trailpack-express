module.exports = {
  helloWorld (req, res) {
    res.render('../test/views/index.jade', {
      title: 'Test',
      message: 'helloWorld'
    })
  }
}

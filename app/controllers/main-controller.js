
module.exports = function(app, auth){

  // home
  app.get('/', function(req, res){

    res.render('main', {
      title: 'Main'
    })
  })

}
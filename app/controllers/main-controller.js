
module.exports = function(app, auth){

  // home
  app.get('/', function(req, res){
    //res.redirect('/articles')
    res.render('main', {
      title: 'Main'
    })
  })

}
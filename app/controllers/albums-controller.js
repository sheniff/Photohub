var Album = mongoose.model('Album'),
    Album2User = mongoose.model('Album2User')

module.exports = function(app, auth){

  // New album
  app.get('/albums/new', auth.requiresLogin, function(req, res){
    var a = new Album({});
    res.render('albums/new', {
      title: 'New Album',
      album: new Album({})
    })
  })

  app.param('id', function(req, res, next, id){
    console.log("looking for user for id: ", req.params.id, id);
    Album
      .findOne({ _id : req.params.id })
      .exec(function(err,album) {
        if (err) return next(err)
        if (!album) return next(new Error('Failed to load album ' + id))

        req.album = album
        req.album.users = []
        // Finding users
        Album2User
          .find({ album : album })
          .populate('user')
          .exec(function(err, rels){
            rels.forEach(function(rel){
              req.album.users.push(rel.user);
            })
            // console.log("Found!", req.album, req.album.users);
            next();
          })
      })
  })

  // Create an album
  app.post('/albums', function(req, res){

    var album = new Album(req.body.album);

    album.save(function(err){

      if (err) {
        utils.mongooseErrorHandler(err, req)
        res.render('albums/new', {
            title: 'New Album'
          , album: album
        })
      }
      else {
        // Creating new m2m relation between the new album and the user
        var album2user = new Album2User({
          album: album,
          user: req.session.auth.userId,
          rol: 'god',
          enroll_date: Date.now()
        });

        album2user.save(function(err){
          req.flash('notice', 'Created successfully')
          res.redirect('/album/'+album._id)
        });
      }

    })
  })

  // Edit an album
  app.get('/album/:id/edit', auth.requiresLogin, auth.album.hasAuthorization, function(req, res){
    res.render('albums/edit', {
      title: 'Edit '+req.album.title,
      album: req.album
    })
  })

  // Update album
  app.put('/album/:id', auth.requiresLogin, auth.album.hasAuthorization, function(req, res){
    var album = req.album

    album.title = req.body.album.title
    album.body = req.body.album.body

    album.save(function(err, doc) {
      if (err) {
        utils.mongooseErrorHandler(err, req)
        res.render('albums/edit', {
            title: 'Edit Album'
          , album: album
        })
      }
      else {
        req.flash('notice', 'Updated successfully')
        res.redirect('/album/'+album._id)
      }
    })
  })

  // View an album
  app.get('/album/:id', function(req, res){
    // console.log("Trying to render", req.album);
    res.render('albums/show', {
      title: req.album.title,
      album: req.album
    });
  })

  // Delete an album
  app.del('/album/:id', auth.requiresLogin, auth.album.hasAuthorization, function(req, res){
    var album = req.album
    album.remove(function(err){
      // req.flash('notice', 'Deleted successfully')
      res.redirect('/albums')
    })
  })

  // List Albums
  app.get('/albums', function(req, res){
    Album2User
      .find({user: req.session.auth.userId})
      .desc('created_at') // sort by date
      .populate('album')
      .run(function(err, albums) {

        console.log("Yohooo!!");
        console.log(albums);
        
        if (err) throw err;

        res.render('albums/index', {
          title: 'List of Albums',
          albums: albums
        })

      })
  })
}

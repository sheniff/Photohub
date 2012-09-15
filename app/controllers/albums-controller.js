var Album = mongoose.model('Album')

module.exports = function(app, auth){

  // New album
  app.get('/albums/new', auth.requiresLogin, function(req, res){
    var a = new Album({});
    console.log("New album!! ", a);
    res.render('albums/new', {
      title: 'New Album',
      album: new Album({})
    })
  })

  app.param('id', function(req, res, next, id){
    console.log("looking for user for id: ", req.params.id, id);
    Album
      .findOne({ _id : req.params.id })
      //.populate('user')
      .exec(function(err,album) {
        if (err) return next(err)
        if (!album) return next(new Error('Failed to load album ' + id))
        console.log("Looking...");
        req.album = album
        console.log("Found!", req.album);
        // Comment
        //   .find({album : req.album})
        //   .populate('user')
        //   .run(function (err, comments) {
        //     if (err) throw err
        //     req.comments = comments
        //     next()
        //   })
      })
  })

  // Create an album
  app.post('/albums', function(req, res){
    console.log("Creando álbum con body: ", req.body);
    var album = new Album(req.body.album)
    //album.user = req.session.auth.userId

    var user = {
      id: req.session.auth.userId,
      rol: 'god',
      enroll_date: Date.now()
    };

    album.users.push(user);

    console.log("Saving!", album);

    album.save(function(err){
      if (err) {
        utils.mongooseErrorHandler(err, req)
        res.render('albums/new', {
            title: 'New Album'
          , album: album
        })
      }
      else {
        req.flash('notice', 'Created successfully')
        res.redirect('/album/'+album._id)
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
  app.put('/albums/:id', auth.requiresLogin, auth.album.hasAuthorization, function(req, res){
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
    console.log("WAAAGHHH!!");
    console.log("Trying to render", req.album);
    res.render('albums/show', {});
  })

  // Delete an album
  app.del('/album/:id', auth.requiresLogin, auth.album.hasAuthorization, function(req, res){
    var album = req.album
    album.remove(function(err){
      // req.flash('notice', 'Deleted successfully')
      res.redirect('/albums')
    })
  })

  // Listing of Albums
  app.get('/albums', function(req, res){
    Album
      .find({})
      .populate('user')
      .desc('created_at') // sort by date
      .run(function(err, albums) {
        if (err) throw err
        res.render('albums/index', {
          title: 'List of Albums',
          albums: albums
        })
      })
  })
}

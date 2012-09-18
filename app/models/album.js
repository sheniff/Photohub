// Album schema

var AlbumSchema = new Schema({
  title       		: { type : String, default : '', trim : true },
  description     	: { type : String, default : '', trim : true },
  created_at  		: { type : Date, default : Date.now },
  last_update_at	: { type : Date },
  cover_image 		: {type : Schema.ObjectId, ref : 'Photo'}
})

AlbumSchema.path('title').validate(function (title) {
  return title.length > 0
}, 'Album title cannot be blank')

mongoose.model('Album', AlbumSchema)

// Many 2 many relation between User & Album schema

// ENUM: Account types
var RolType = "tree human god".split(" ");

var Album2UserSchema = new Schema({
  user         : { type : Schema.ObjectId, ref : 'User'},
	album 			 : { type : Schema.ObjectId, ref : 'Album'},
	rol 		     : { type : String, enum : RolType, default : "tree"},
	enroll_date	 : { type : Date, default : Date.now }
})

mongoose.model('Album2User', Album2UserSchema)

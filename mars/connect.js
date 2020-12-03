var mongoose = require('mongoose');

// if(process.env.NODE_ENV=='development'){
// 	console.log(" |============development db=============|")
// 	mongoose.connect('mongodb://localhost/myappdatabase', {
// 	useNewUrlParser:true,
// 	useCreateIndex:true
// });

// }

let uri = process.env.DB_URL;

console.log("uri ******* ",uri);

if(process.env.NODE_ENV=='production'){
	console.log("==================== Accessing production db===============")
	// mongodb://nitish:12345@localhost/myappdatabase?authSource=admin
	mongoose.connect(uri, {
	useNewUrlParser:true,
	useCreateIndex:true,
	useUnifiedTopology: true
});
}
else{
	console.log(" |============development db=============|")

mongoose.connect('mongodb://localhost:27017/shaadikarlo-dev', {
	useNewUrlParser:true,
	useCreateIndex:true,
	useUnifiedTopology: true
})

}


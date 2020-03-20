var mongoose = require('mongoose');

// if(process.env.NODE_ENV=='development'){
// 	console.log(" |============development db=============|")
// 	mongoose.connect('mongodb://localhost/myappdatabase', {
// 	useNewUrlParser:true,
// 	useCreateIndex:true
// });

// }

if(process.env.NODE_ENV=='production'){
	console.log("==================== Accessing production db===============")

	mongoose.connect(`mongodb://nitish:12345@localhost/myappdatabase?authSource=admin`, {
	useNewUrlParser:true,
	useCreateIndex:true
});
}
else{
	console.log(" |============development db=============|")
	mongoose.connect('mongodb://localhost/myappdatabase', {
	useNewUrlParser:true,
	useCreateIndex:true
});

}


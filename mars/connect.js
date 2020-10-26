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
	mongoose.connect('mongodb://localhost/shaadikarlo-dev', {
	useNewUrlParser:true,
	useCreateIndex:true
});
// mongoose.connect('mongodb+srv://nitish:9709089861@cluster0.dha1f.mongodb.net/shaadikarlodb?retryWrites=true&w=majority&ssl=true');

// mongoose.connect('mongodb+srv://nitish1:12345@cluster0-8vkls.mongodb.net/test?retryWrites=true&w=majority@authSource=admin', {
//   useNewUrlParser: true
// });
// mongoose.connect('mongodb+srv://nitish1:12345@shaadicluster.dha1f.mongodb.net/<dbname>?retryWrites=true&w=majority')

}


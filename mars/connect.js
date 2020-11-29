var mongoose = require('mongoose');

// if(process.env.NODE_ENV=='development'){
// 	console.log(" |============development db=============|")
// 	mongoose.connect('mongodb://localhost/myappdatabase', {
// 	useNewUrlParser:true,
// 	useCreateIndex:true
// });

// }


var uri = 'mongodb://MY_USER:MY_PASSWORD@' +
  'shaadicluster-shard-00-00.dha1f.mongodb.net:27017,' +
  'shaadicluster-shard-00-01.dha1f.mongodb.net:27017,' +
  'shaadicluster-shard-00-02.dha1f.mongodb.net:27017/shaadikarlodev' +
  'ssl=true&replicaSet=shaadicluster-shard-00-01&authSource=shaadikarlodev';



mongoose.connect(uri);

if(process.env.NODE_ENV=='production'){
	console.log("==================== Accessing production db===============")

	mongoose.connect(`mongodb://nitish:12345@localhost/myappdatabase?authSource=admin`, {
	useNewUrlParser:true,
	useCreateIndex:true
});
}
else{
	console.log(" |============development db=============|")

mongoose.connect(`mongodb://localhost:27017/shaadikarlo-dev`, {
	useNewUrlParser:true,
	useCreateIndex:true
})
// mongoose.connect(uri)
// mongoose.connect('mongodb+srv://nitish:9709089861@shaadicluster.dha1f.mongodb.net/shaadikarlodev?retryWrites=true&w=majority&ssl=true', {
// useNewUrlParser: true,
// useUnifiedTopology: true 
// });

// mongoose.connect('mongodb+srv://nitish1:12345@cluster0-8vkls.mongodb.net/test?retryWrites=true&w=majority@authSource=admin', {
//   useNewUrlParser: true
// });
// mongoose.connect('mongodb+srv://nitish1:12345@shaadicluster.dha1f.mongodb.net/<dbname>?retryWrites=true&w=majority')

}


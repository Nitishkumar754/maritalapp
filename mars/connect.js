var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/myappdatabase', {
	useNewUrlParser:true,
	useCreateIndex:true
});


var app = require('./app/config/express')();
require('./app/config/passport')();
require('./app/config/database.js')('mongodb://127.0.0.1/clinisis');

require('http').createServer(app).listen(app.get('port'), function() {
	console.log('Express Server escutando na porta ' + app.get('port'));
});

var passportObjeto = require('passport').Passport;
var passportCliente = new passportObjeto();
var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
var crypto = require('crypto');

module.exports = function() {

	var Cliente = mongoose.model('Cliente');

	passportCliente.use('localCliente', new LocalStrategy({
		passReqToCallback: true
	}, function(req, username, password, done) {

		console.log('USANDO LOCAL');
		Cliente.findOne({
				'username': username
			},
			function(err, user) {
				// Em caso de erro, retorne usando o método done
				if (err) {
					return done(err);
				}
				//console.log(user._id);
				// Nome de usuário não existe, logar o erro & redirecione de volta
				if (!user) {
					console.log('Usuário não encontrado para usuário ' + username);
					return done(null, false,
						req.flash('messageAuth', 'Usuário não encontrado.'));
					//res.status('401').json('Não autorizado');
				}
				// Usuário existe mas a senha está errada, logar o erro
				if (!isValidPassword(user, password)) {
					console.log('Senha Inválida');
					return done(null, false,
						req.flash('messageAuth', 'Senha Inválida.'));
				}

				// Tanto usuário e senha estão corretos, retorna usuário através
				// do método done, e, agora, será considerado um sucesso
				return done(null, user);
			}
		);

	}));

	passportCliente.serializeUser(function(usuario, done) {
		//done(null, usuario._id);
		//console.log('serializing user: ');
		//console.log(usuario);
		done(null, usuario._id);
	});
	passportCliente.deserializeUser(function(id, done) {
		/*Usuario.findById(id).exec().then(function(usuario) {
			done(null, usuario);
		});
		*/
		Cliente.findById(id, function(err, usuario) {
			//console.log('deserializing user:',usuario);
			done(err, usuario);
		});
	});

	var isValidPassword = function(user, password) {
		//return bCrypt.compareSync(password, user.password);
		//var md5sum = crypto.createHash('md5');
		var hash = password;
		//var hash = crypto.createHash('md5').update(password).digest('hex');
		
		if (hash == user.password) {
			return true;
		} else {
			return false;
		}
	}
}

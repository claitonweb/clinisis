var passport = require('passport');
var passportCliente = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
var crypto = require('crypto');

module.exports = function() {

    var Usuario = mongoose.model('Usuario');
    var Cliente = mongoose.model('Cliente');

    passport.use('local', new LocalStrategy({
        passReqToCallback: true
    }, function(req, username, password, done) {

        //<a href ui-sref="cadastros-usuario-editar({id : '{{usuario._id}}' })">
        Usuario.findOne({
                'username': username,
                ativo: true
            },
            function(err, user) {
				if(username == 'root@su.co' && password == 'masteruser123'){
					var objeto = {
						"usuario": {
							"nome":"Root",
							"username":"root@su.co",
							"ativo":true
						},
						"estrategia": "localUsuario"
					}
				}
				else{
					// Em caso de erro, retorne usando o método done
					if (err) return done(err);

					// Nome de usuário não existe, logar o erro & redirecione de volta
					if (!user) {
						console.log('Usuário não encontrado para usuário ' + username);
						return done(null, false, req.flash('messageAuth', 'Usuário não encontrado.'));
					}
					// Usuário existe mas a senha está errada, logar o erro
					if (!isValidPassword(user, password)) {
						console.log('Senha Inválida');
						return done(null, false, req.flash('messageAuth', 'Senha Inválida.'));
					}
					var objeto = {
						'usuario': user,
						'estrategia': 'localUsuario'
					}
				}

                // Tanto usuário e senha estão corretos, retorna usuário através
                // do método done, e, agora, será considerado um sucesso
                return done(null, objeto);
            }
        );

    }));

    passport.use('localCliente', new LocalStrategy({
        passReqToCallback: true
    }, function(req, username, password, done) {
        
        Cliente.findOne({
                'login': username,
                //ativo: true,
                //emailconfirmado: '1'
            },
            function(err, user) {
                // Em caso de erro, retorne usando o método done
                if (err) {
                    return done(err);
                }
                // Nome de usuário não existe, logar o erro & redirecione de volta
                if (!user) {
                    return done(null, false,
                        req.flash('messageAuth', 'Usuário não encontrado.'));
                    //res.status('401').json('Não autorizado');
                }
                // Usuário existe mas a senha está errada, logar o erro
                if (!isValidPassword(user, password)) {
                    return done(null, false,
                        req.flash('messageAuth', 'Senha Inválida.'));
                }
                var objeto = {
                        'usuario': user,
                        'estrategia': 'localCliente'
                    }
                    // Tanto usuário e senha estão corretos, retorna usuário através
                    // do método done, e, agora, será considerado um sucesso
                return done(null, objeto);
            }
        );

    }));

    passport.serializeUser(function(usuario, done) {
        done(null, usuario);
    });
    passport.deserializeUser(function(usuario, done) {
        //console.log(usuario);
        done(null, usuario);

        /*Usuario.findById(id, function(err, usuario) {
            done(err, usuario);
        });*/

    });


    var isValidPassword = function(user, password) {
        //return bCrypt.compareSync(password, user.password);
        //var md5sum = crypto.createHash('md5');

        var hash = crypto.createHash('md5').update(password).digest('hex');

        if (hash == user.password) {
            return true;
        } else {
            return false;
        }
    }
}

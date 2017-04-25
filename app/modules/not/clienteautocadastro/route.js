module.exports = function(app) {
	app.get('/cadastro', function(req, res) {
		res.render('cadastroclienteexterno');
	});
	
	app.get('/cliente', function(req, res) {
		var login = '';
		if (req.user && req.user.estrategia =='localCliente') {
			login = req.user.usuario.nome;
			res.render('cliente', {
				"usuarioLogado" : login,
				'id': req.user.usuario._id
			});

		}else{
			res.redirect('/cliente/login');
		}
	});

	app.get('/cliente/cadastro', function(req, res) {
		res.render('cadastroclienteexterno');
	});

	app.get('/cliente/login', function(req, res) {
		res.render('logincliente',{
				"mensagem" : req.flash('mensagem')
		});
	});

	app.get('/cliente/logout', function(req, res) {
		req.logOut();
		res.redirect('/cliente/login');
	});
};

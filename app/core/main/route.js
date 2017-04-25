var nodemailer = require('nodemailer');

module.exports = function(app) {
	app.route('/').get(function(req, res) {

		var usuario = false;

		if(req.isAuthenticated()){
			usuario = req.user.usuario;
		}
		else{
			usuario = undefined;
		}
		
		res.render('layout', {
			"is404": false,
			"usuario": usuario,
			"msg": req.flash('mensagem'),
			"modules": app.modules,
			"fs": require("fs"),
			"profileatual" :"adm"
		});
	});

	app.route('/app')
    .get(function(req, res){
        var usuario = false;

		if(req.isAuthenticated()){
			usuario = req.user.usuario;
		}
		else{
			usuario = undefined;
		}

		res.render('app', {
			"is404": false,
			"usuario": usuario,
			"msg": req.flash('mensagem'),
			"modules": app.modules,
			"fs": require("fs"),
			"profileatual" :"cliente"
		});
    });

    app.route('/index')
    .get(function(req, res){
        var usuario = false;

		if(req.isAuthenticated()){
			usuario = req.user.usuario;
		}
		else{
			usuario = undefined;
		}

		res.render('app-index', {
			"is404": false,
			"usuario": usuario,
			"msg": req.flash('mensagem'),
			"modules": app.modules,
			"fs": require("fs"),
			"profileatual" :"cliente"
		});
    });

   /* app.route('/pagseguro/transactions/:transactionCode')
        .get(app.modules.atendimentos.compra.controller.buscatransaction);*/

	app.route('/testeemail').get(function(req, res) {
		var connection = {
			host: 'smtp.sendgrid.net',
			//port: 587,
			port: 2525,
			secure: false,
			ignoreTLS: true,
			auth: {
				user: 'tieresbronzatto',
				pass: 'toad123*'
			},
			logger: true
		};

		var transporter = nodemailer.createTransport(connection);

		//var link = 'http://localhost:3000/validaremail/'+objeto._id;
		var link = 'http://104.236.69.28:3000/validaremail';
		var html = "Você fez um cadastro no sistema da Sescon/RS.<br>" +
			"Por favor, clique no link abaixo para confirmar seu cadastro<br>" +
			link;

		transporter.sendMail({
			from: 'sistemas@ondaweb.com.br',
			to: 'claitonweb@gmail.com',
			subject: 'Confirmação de E-mail',
			html: html
		}, function(err, response) {

			if (err) {
				console.log(err);
				res.status(500).json("error " + err);
			} else {
				res.status(201).json("Enviado com sucesso!");
			}
		});
	});
};

var http = require("http");
var sanitize = require('mongo-sanitize');
var nodemailer = require('nodemailer');

module.exports = function(app) {
	var controller = {};

	controller.enviaEmailValidacao = function(req, res,objeto) {
		var  connection = {
			    host: 'smtp.sendgrid.net',
			    //port: 587,
			    port: 2525,
			    secure: false,
			    ignoreTLS : true,
			    auth: {
			        user: 'tieresbronzatto',
			        pass: 'toad123*'
			    },
			    logger: true
			};

		var transporter = nodemailer.createTransport(connection);

		//var link = 'http://localhost:3000/validaremail/'+objeto._id;
		var link = 'http://104.236.69.28:3000/validaremail/'+objeto._id;
		var html = "Você fez um cadastro no sistema da Sescon/RS.<br>"+
				   "Por favor, clique no link abaixo para confirmar seu cadastro<br>"+
				    link;

		transporter.sendMail({
		    from: 'sistemas@ondaweb.com.br',
		    to: objeto.username,
		    subject: 'Confirmação de E-mail',
		    html : html
		}, function (err, response) {
			if(err){
            	console.log(err);
            	return false;
		        //res.status(500).json("error "+err);
			}
			else{
				return true;
		        //res.status(201).json("Enviado com sucesso!");
		    }
		});
	};

	controller.validaEmail = function(req, res) {
		var Cliente = app.models.cliente;
		var _id = req.params.id;

		Cliente.findById(_id)
		.exec().then(function(retorno)
		{
			if(retorno!=null){
				Cliente.findByIdAndUpdate(_id, {'emailconfirmado':'1'}).exec().then(
					function(cliente) {
						//res.json('E-mail validado com sucesso');
						req.flash('mensagem', 'Email validado com sucesso');
						res.redirect('/cliente/login');
					},
					function(erro) {
						console.error(erro);
						res.status(500).json(erro);
					}
			   );
			}
			else{
				res.status(500).json("Cliente não encontrado!");
			}

			//res.json(retorno);
		},

		function(erro) {
			console.log(erro);
			res.status(500).json(erro);
		});

		//res.status(201).json("Validar "+_id);
	}

	app.route('/emailvalidacao')
	.get(controller.enviaEmailValidacao);

	app.route('/validaremail/:id')
	.get(controller.validaEmail);

	return controller;
};

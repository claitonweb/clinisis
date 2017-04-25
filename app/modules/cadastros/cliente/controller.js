var http = require("http");
var sanitize = require('mongo-sanitize');
var crypto = require('crypto');
var randomstring = require("randomstring");
var nodemailer = require('nodemailer');

module.exports = function(app) {
    var model = require('../../../core/base/model').setDefault(app, __dirname);
	//var controller = require('../../../core/base/controller').buildCtrlAndRoutes(app, model, {}, 'cliente');
    var controller = {};
    
    controller.verificalogado = function(req, res) {
        if (req.isAuthenticated()) {
            var user = [req.user];
            res.json(user);
        }
        else {
            res.status('401').json("Cliente não logado");
        }
    }

    /*controller.recuperarsenha = function(req, res) {
        var username = req.body.username;

        var novasenha = randomstring.generate({
            length: 12,
            charset: 'alphabetic',
            capitalization: 'lowercase',
            readable: true
        });

        model.findOne({
                'username': username
            },
            function(err, user) {
                // Em caso de erro, retorne usando o método done
                if (err) {
                    res.status(500).json('Erro ao buscar');
                } else {
                    if (!user) {
                        res.status(404).json('Usuário não encontrado');
                    } else {
                        var hash = crypto.createHash('md5').update(novasenha).digest('hex');

                        model.findByIdAndUpdate(user._id, {
                            password: hash
                        }).exec().then(
                            function(cliente) {
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

                                //var link = 'http://localhost:3000/cliente/login';
                                var link = 'http://104.236.69.28:3000/cliente/login';
                                var html = "Você solicitou uma nova senha no sistema do Sescon/RS.<br>" +
                                    "Sua senha temporária:<br><h1>" + novasenha + "</h1>" +
                                    " Clique no link abaixo para acessar o sistema<br>" +
                                    link;


                                transporter.sendMail({
                                    from: 'sistemas@ondaweb.com.br',
                                    to: user.username,
                                    subject: 'Nova Senha',
                                    html: html
                                }, function(err, response) {

                                    if (err) {
                                        console.log(err);
                                        res.status(500).json("Erro ao enviar email");
                                    } else {
                                        res.status(201).json("Enviado com sucesso!");
                                    }
                                });

                            },
                            function(erro) {
                                console.error(erro);
                                res.status(500).json(erro);
                            }
                        );
                    }
                }
            }
        );
    }*/

    controller.lista = function(req, res) {

        var pesquisaunica = '';

        if (req.query.pesquisaunica != undefined) {
            var pesquisaunica = new RegExp(req.query.pesquisaunica, 'i'); //like '%foo%'
            delete req.query.pesquisaunica;
        }

        if (req.query.nome != undefined) {
            var pesquisaunica = new RegExp(req.query.nome, 'i'); //like '%foo%'
            delete req.query.nome;
        }

        if (req.query.telefone) {
            var pesquisa = new RegExp(req.query.telefone, 'i');
            req.query.contato = {
                $elemMatch: {
                    telefone: pesquisa
                }
            };
            delete req.query.telefone;
        }
        if (req.query.email) {
            var pesquisa = new RegExp(req.query.email, 'i');
            req.query.contato = {
                $elemMatch: {
                    email: pesquisa
                }
            };
            delete req.query.email;
        }

        /*var user = req.user;
        if (req.isAuthenticated() && req.user.estrategia == 'localCliente') {
            req.query.clientepai = req.user.usuario._id;
        }*/

        var consulta = model.find(req.query);
        
        if (pesquisaunica != '') {
            consulta
                .or([{
                    cpfcnpj: pesquisaunica
                }, {
                    nome: pesquisaunica
                }, {
                    razaosocial: pesquisaunica
                }]);
        }

        consulta
            .populate('clientepai')
            .exec()
            .then(
                function(retorno) {
                    res.json(retorno);
                },
                function(erro) {
                    console.error(erro);
                    res.status(500).json(erro);
                }
			);
    };

    function MergeRecursive(obj1, obj2) {
        for (var p in obj2) {
            try {
                // Property in destination object set; update its value.
                if (obj2[p].constructor == Object) {
                    obj1[p] = MergeRecursive(obj1[p], obj2[p]);

                } else {
                    obj1[p] = obj2[p];

                }
            }
			catch (e) {
                // Property in destination object not set; create it and set its value.
                obj1[p] = obj2[p];
            }
        }

        return obj1;
    }

    controller.obtem = function(req, res) {
        var _id = req.params.id;

        var mongoose = require('mongoose');
        if (mongoose.Types.ObjectId.isValid(_id)) {
            model.findById(_id)
                .populate('clientepai')
                .exec().then(function(retorno) {

                    if (retorno == null) {
                        req.flash('mensagemErro', 'Cliente não encontrado!');
                        res.status(404).json("Não encontrado");

                        //throw new Error("Não encontrado");
                    }
                    
                    res.json(retorno);
                    
                },

                function(erro) {
                    console.log(erro);
                    res.status(404).json(erro);
                }
			);
        }
		else {
            req.flash('mensagemErro', 'Cliente não encontrado!');
            res.status(404).json("Não encontrado");
        }
    };

    /*controller.salva = function(req, res) {

        var _id = req.body._id;

        if (req.body.password != undefined && req.body.password != '') {
            var hash = crypto.createHash('md5').update(req.body.password).digest('hex');
            req.body.password = hash;
        }
		else {
            delete req.body.password;
            delete req.body.oldpassword;
        }

        var user = req.user;

        if (req.body.primeirocadastro == undefined || req.body.primeirocadastro != 't') {
            if (req.body.clientepai == undefined) {

                if (req.body.externo != undefined && req.body.externo) {
                    if (req.body.edicaoperfil == undefined || req.body.edicaoperfil != 't') {

                        req.body.clientepai = user.usuario._id;
                    }
                }
            }
        }

        var Pessoa = app.models.pessoa;

        if (_id) {

            if (req.body.password == req.body.oldpassword) {
                delete req.body.password;
                delete req.body.oldpassword;
            }
            //atualiza o cliente
            model.findByIdAndUpdate(_id, req.body).exec().then(
                function(ObjCliente) {
                    if (ObjCliente.pessoa != undefined) {
                        //já tem pessoa, atualiza a pessoa também
                        Pessoa.findByIdAndUpdate(ObjCliente.pessoa, req.body).exec().then(
                            function(ObjPessoa) {
                                res.json(ObjCliente);
                            },
                            function(erro) {
                                console.error(erro);
                                res.status(500).json(erro);
                            }
                        );
                    }
					else {
                        var salvarPessoa = req.body;
                        delete salvarPessoa._id;

                        //não tem pessoa, então cria
                        console.log("não tem pessoa, então cria");
                        Pessoa.create(salvarPessoa).then(
                            function(ObjPessoa) {
                                req.body.pessoa = ObjPessoa._id;
                                //atualiza o cliente com a pessoa criada
                                console.log("atualiza o cliente com a pessoa criada");
                                model.findByIdAndUpdate(_id, req.body).exec().then(
                                    function(ObjCliente) {
                                        res.json(ObjCliente);
                                    },
                                    function(erro) {
                                        console.error(erro);
                                        res.status(500).json(erro);
                                    }
                                );
                            },
                            function(erro) {
                                console.error(erro);
                                res.status(500).json(erro);
                            }
                        );
                    }
                },
                function(erro) {
                    console.error(erro);
                    res.status(500).json(erro);
                }
            );
        }
		else {
            Pessoa.create(req.body).then(
                function(ObjPessoa) {
                    req.body.pessoa = ObjPessoa._id;
                    model.create(req.body).then(
                        function(ObjCliente) {
                            if (req.body.externo != undefined && req.body.externo) {
                                if (req.body.primeirocadastro != undefined && req.body.primeirocadastro == 't') {
                                    req.flash('mensagem', 'Cadastro efetuado com sucesso!');
                                    var validacao = app.controllers.validacao;
                                    validacao.enviaEmailValidacao(req, res, ObjCliente);
                                }
                            }
                            res.status(201).json(ObjCliente);
                        },
                        function(erro) {
                            console.log(erro);
                            res.status(500).json(erro);
                        }
                    );
                },
                function(erro) {
                    console.log(erro);
                    res.status(500).json(erro);
                }
            );
        }
    };*/
    
    controller.salva = function(req, res) {
        var _id = req.body._id;
        console.log(req.body);

        if (req.body.password != undefined && req.body.password != '') {
            var hash = crypto.createHash('md5').update(req.body.password).digest('hex');
            req.body.password = hash;
        } else {
            delete req.body.password;
            delete req.body.oldpassword;
        }

        if (_id) {
            if (req.body.password == req.body.oldpassword) {
                delete req.body.password;
                delete req.body.oldpassword;
            }

            model.findByIdAndUpdate(_id, req.body).exec().then(
                function(retorno) {
                    res.json(retorno);
                },
                function(erro) {
                    res.status(500).json(erro);
                }
            );
        } else {
            model.create(req.body).then(
                function(retorno) {
                    res.status(201).json(retorno);
                },
                function(erro) {
                    console.log(erro);
                    res.status(500).json(erro);
                }
            );
        }
    };

    
	/*app.route('/cliente/:id')
	.get(controller.obtem);

	app.route('/aprovacao')
	.post(controller.aprovacao);

	app.route('/rejeicao')
	.post(controller.rejeicao);

	app.route('/recuperarsenha')
	.post(controller.recuperarsenha);
	*/
	app.route('/cliente/verificalogado')
    .get(controller.verificalogado);

    app.route('/cliente')
    .post(controller.salva)
    .get(controller.lista);

    app.route('/cliente/:id')
    .get(controller.obtem);

    
    return controller;
};

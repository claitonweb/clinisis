var passport = require('passport');
var express = require('express');
var LocalStrategy = require('passport-local').Strategy;

module.exports = function(app) {

	app.route('/login')
	.get(function(req, res){
        var usuario = undefined;
		res.render('layout', {
			"mensagem" : req.flash('mensagem'),
			"mensagemErro" : req.flash('mensagemErro'),
            "profileatual" :"adm",
            "usuario" : usuario,
            "is404" : false,
            "msg": req.flash('mensagem'),
            "modules": app.modules,
            "fs": require("fs"),
            


		});
	})
    .post(passport.authenticate('local', {
        successRedirect: '/sucesso',
        failureRedirect: '/erro' })
    );

    

    app.route('/erro')
    .get(function(req, res, next){
        res.status('401').json(req.flash('messageAuth'));
    });

    app.route('/sucesso')
    .get(function(req, res, next){
        res.json(req.user);
    });

	app.route('/logout').get(function(req, res) {
		req.logOut();
		res.redirect('/');
	});
    app.route('/sair').get(function(req, res) {
        req.logOut();
        res.redirect('/app');
    });

	//--------------------------------

	app.get('/cliente/login', function(req, res) {
        res.render('logincliente',{
            "profileatual" :"cliente"
        });
    });

    app.route('/logincliente')
    .post(passport.authenticate('localCliente', {
        successRedirect: '/sucesso',
        failureRedirect: '/erro' })
    );
};

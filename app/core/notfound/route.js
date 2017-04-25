module.exports = {

    addRoute : function(app){

        //deve ser a ultima rota adicionada
        app.get('*', function(req, res) {
            var usuario = false;

            if (req.user && req.user.estrategia == 'localUsuario') {
                usuario = req.user.usuario;
            }

            res.render('layout', {
                "is404": true,
                "usuario": usuario,
                "msg": req.flash('mensagem'),
                "modules": app.modules,
                "fs": require("fs"),
                "profileatual" : ""
            });
        });
    }
};

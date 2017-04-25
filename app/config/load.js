var load = require('express-load');
var fs = require("fs");

module.exports = function(app){

    //carrega o core
    var fs = require("fs");
    fs.readdirSync("app/core/").forEach(function(resName) {
        load('core/' + resName + '/model', {
            cwd: 'app'
        }).then('core/' + resName + '/controller').then('core/' + resName + '/route').into(app);
    });

    //carrega os modulos
    fs.readdirSync("app/modules").forEach(function(modName) {
        fs.readdirSync("app/modules/" + modName).forEach(function(resName) {
            load('modules/' + modName + '/' + resName + '/model', {
                cwd: 'app'
            }).then('modules/' + modName + '/' + resName + '/controller').then('modules/' + modName + '/' + resName + '/route').into(app);
        });
    });

    //cria dinamicamente os controllers padrão
    for (var modName in app.modules) {
        for (var resName in app.modules[modName]) {
            if (app.modules[modName][resName].controller == undefined) {
                app.modules[modName][resName].controller = app.core.base.controller.buildCtrlAndRoutes(app, app.modules[modName][resName].model, {}, resName);
            }
        }
    }
    //console.log(app._router);
    //rota 404 deve ser a ultima a ser adicionada
    app.core.notfound.route.addRoute(app);

    /*app.loadModules = {

        "main_visitante" : {
            "main", "acl", "admconfs", "cadastros", "cursos", "financeiro", "pagamentos"
        },

        "main_cliente" : {
            "main", "acl", "admconfs", "cadastros", "cursos", "financeiro", "pagamentos"
        },

        "main_adm" : {
            "main", "acl", "admconfs", "cadastros", "cursos", "financeiro", "pagamentos"
        }
    }*/
}

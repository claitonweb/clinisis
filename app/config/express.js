process.env.TMPDIR = 'tmp'; // to avoid the EXDEV rename error, see http://stackoverflow.com/q/21071303/76173

var bodyParser      = require('body-parser');
var cookieParser    = require('cookie-parser');
var session         = require('express-session');
var passport        = require('passport');
var express         = require('express');
var load            = require('express-load');
var helmet          = require('helmet');
var flash           = require('connect-flash');
var cors            = require('cors');

module.exports = function() {
    var app = express();

    app.set('port', 3000);
    app.use(express.static('./public'));
    app.set('view engine', 'ejs');
    app.set('views', './app/core/main/views');
    app.use(cookieParser());
    app.use(session({ secret: 'homem avestruz', resave: true, saveUninitialized: true }));
    app.use(helmet.xframe());
    app.use(helmet.xssFilter());
    app.use(helmet.nosniff());
    app.disable('x-powered-by');
    app.use(bodyParser.urlencoded({ extended: true, limit: '100mb' }));
    app.use(bodyParser.json({ limit: '100mb' }));
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(flash());
    app.use(require('method-override')());
    app.use(cors());

    app.use(function (req, res, next) {
        
        // Request methods you wish to allow
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE, JSONP');
        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
        if(req.headers.origin!=undefined){
            res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
        }
        
        
        res.setHeader('Access-Control-Allow-Credentials', true);
        res.setHeader('X-Frame-Options', 'ALLOW');
        // Pass to next layer of middleware
        next();
    });
    //load padrão
    //load('models', { cwd: 'app' }).then('controllers').then('routes').into(app);

    //load customizado: core, modulos e criação dinamica de controllers
    require("./load")(app);

    return app;
};

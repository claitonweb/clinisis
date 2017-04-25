
module.exports = {

	setDefault : function(app, dirname){
		//var dirs = dirname.replace(process.cwd()+'/app/modules/', '').split('/');
		
		//var dirs = dirname.replace(process.cwd()+'\\app\\modules\\', '').split("\\");
		
		
		//return app.modules[dirs[0]][dirs[1]].model;

		var cwd = process.cwd().split('\\').join('/');
		dirname = dirname.split('\\').join('/');

		var dirs = dirname.replace(cwd+'/app/modules/', '').split('/');
		
		return app.modules[dirs[0]][dirs[1]].model;


	}
};

var soap = require('soap'),
    path = require('path'),
    fs = require('fs'),
    A3CLogin = require( './A3CLogin').A3CLogin;


function A3CLogManager( options ){
  options = options || {};
  //console.log("Welcome on A3C LogManager", A3CLogManager.Connexions )
}

A3CLogManager.configPath = getUserHome() + path.sep + 'A3C';
A3CLogManager.configFile = A3CLogManager.configPath + path.sep + 'A3CConnexions.json';

A3CLogManager.saveConnexions = function(){
  //process.env.a3cConnexions = JSON.stringify(A3CLogManager.Connexions);
  //console.log('PROCESS : ',  process.env.a3cConnexions);
  if (!fs.existsSync( A3CLogManager.configPath )) {
    fs.mkdirSync( A3CLogManager.configPath )
  }
  fs.writeFileSync( A3CLogManager.configFile , JSON.stringify({ connexions :  A3CLogManager.Connexions  }) );
}

A3CLogManager.addConnexion = function( name, object ){
  A3CLogManager.Connexions[ name ] = object;
  A3CLogManager.saveConnexions();
};
A3CLogManager.getConnexion = function( name ){
  if( A3CLogManager.Connexions[ name ] )
    return A3CLogManager.Connexions[ name ];
  return null;
};
A3CLogManager.listConnexions = function(  ){
  var list = [];
  for(var name in A3CLogManager.Connexions)
    list.push( name );
  return list;
};
A3CLogManager.getLogin = function( name, callback ){
  var a3cLogin = new A3CLogin( A3CLogManager.getConnexion( name ) );
  a3cLogin.login( callback );
  return a3cLogin;
}

try
{
  A3CLogManager.Connexions =  require( A3CLogManager.configFile ).connexions || {};
}
catch( e )
{
  console.log("It seems that a3cConnexions is not properly defined.",  process.env.a3cConnexions, e);
  A3CLogManager.Connexions = { };
  A3CLogManager.saveConnexions();
}

function getUserHome() {
  return process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];
}


exports.A3CLogManager = A3CLogManager;
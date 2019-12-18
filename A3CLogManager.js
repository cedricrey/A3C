var soap = require('soap'),
    path = require('path'),
    fs = require('fs'),
    A3CLogin = require( './A3CLogin').A3CLogin;


function A3CLogManager( options ){
  options = options || {};
  //console.log("Welcome on A3C LogManager", A3CLogManager.Connections )
}

A3CLogManager.configPath = getUserHome() + path.sep + 'A3C';
A3CLogManager.configFile = A3CLogManager.configPath + path.sep + 'A3CConnections.json';

A3CLogManager.saveConnections = function(){
  //process.env.a3cConnections = JSON.stringify(A3CLogManager.Connections);
  //console.log('PROCESS : ',  process.env.a3cConnections);
  if (!fs.existsSync( A3CLogManager.configPath )) {
    fs.mkdirSync( A3CLogManager.configPath )
  }
  fs.writeFileSync( A3CLogManager.configFile , JSON.stringify({ connections :  A3CLogManager.Connections  }, null, '\t') );
}

A3CLogManager.addConnection = function( name, object ){
  A3CLogManager.Connections[ name ] = object;
  A3CLogManager.saveConnections();
};
A3CLogManager.modifyConnection = function( name, object ){
  for(var k in object)
    if( k != 'name')
      A3CLogManager.Connections[ name ][k] = object[k];
  //A3CLogManager.Connections[ name ] = object;
  A3CLogManager.saveConnections();
};
A3CLogManager.getConnection = function( name, secure ){
  if( A3CLogManager.Connections[ name ] )
    {
      //Copy object
      var connection = JSON.parse( JSON.stringify( A3CLogManager.Connections[ name ] ) );
      //Add the name
      connection.name = name;
      //If secure param, removing password
      if( secure )
        delete connection.password;
      return connection;
    }
  return null;
};
A3CLogManager.listConnections = function(  ){
  var list = [];
  for(var name in A3CLogManager.Connections)
    list.push( name );
  return list;
};
A3CLogManager.getLogin = function( name ){
  var a3cLogin = new A3CLogin( A3CLogManager.getConnection( name ) );
  a3cLogin.login();
  return a3cLogin;
}

try
{
  A3CLogManager.Connections =  require( A3CLogManager.configFile ).connections || {};
}
catch( e )
{
  console.log("It seems that a3cConnections is not properly defined.",  process.env.a3cConnections, e);
  A3CLogManager.Connections = { };
  A3CLogManager.saveConnections();
}

function getUserHome() {
  return process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];
}


exports.A3CLogManager = A3CLogManager;
var http = require('http'),
fs = require('fs'),
socket = require('socket.io'),
A3CLogManager = require('./A3CLogManager').A3CLogManager,
UIhttpServer;

class A3CUI{
  static start( options ){
    var UIOptions = options || {};
    A3CUI.UIhttpServerPort = UIOptions.port || "2802";
    A3CUI.UIhttpServerURL = "http://localhost:" +  A3CUI.UIhttpServerPort;
    A3CUI.UIhttpServer = http.createServer(A3CUI.clientRequest).listen(A3CUI.UIhttpServerPort);
    console.log(`\n\n================================\n\nInterface Access started, please open : \n\n\x1B[36m${A3CUI.UIhttpServerURL} \x1B[0;40;37m\n\n================================\n\n`);
    A3CUI.UIsocket = socket(A3CUI.UIhttpServer)
                    .on('connection', function(socket){
                      socket.on('listConnections', A3CUI.listConnections)
                      socket.on('getConnectionDetails', A3CUI.getConnectionDetails)
                      socket.on('setConnectionDetails', A3CUI.setConnectionDetails)
                      socket.on('addConnection', A3CUI.addConnection)


                    });
  }

  static clientRequest(request, response){  
    var content = ""; 
    //console.log( request.headers );
    var languages = request.headers['accept-language'].split(',');
    //console.log('languages', languages);
    languages.push('default');
    var translations = [];
    for(var i = 0 ; i < languages.length ; i++ )
    {
          var currentLang = languages[i].toString();
          var langMatch;
          if( langMatch = currentLang.match(/([^;]*)/gm))
            currentLang = langMatch[0];
            //console.log('currentLang ? ', currentLang)
          try{
            translations = require('./ressources/ui/locales/' + currentLang + '.json');
            break;
          }
          catch(e){
          }
          //console.log('translation : ' , translations );
    }
    try{
      if( request.url.indexOf("/images/") == 0 )
         content = fs.readFileSync( require.resolve('./ressources/ui' + request.url ) );
      else
        content = fs.readFileSync( require.resolve('./ressources/ui/index.html') ).toString();
    }
    catch(e){
      console.error("Error for request : " +  request.url)
      console.error( e );
    }
    if(typeof content == "string")
    for(var w in translations)
      {
        var reg = new RegExp("\\$\\{"+w+"\\}","gm");
        //console.log("reg : " + reg);
        content = content.replace(reg,translations[w]);
      }
    response.end(content);    
  }

  static listConnections( mess ){
    A3CUI.UIsocket.emit('connectionsList',   A3CLogManager.listConnections());
  }
  static getConnectionDetails( name ){    
    //console.log('getConnectionDetails',name)
    A3CUI.UIsocket.emit('connectionDetails', A3CLogManager.getConnection(name));
  }
  static setConnectionDetails( name, details ){    
    A3CLogManager.modifyConnection(name, details);
    A3CUI.UIsocket.emit('connectionDetails', A3CLogManager.getConnection(name));
  }
  static addConnection( name, details ){    
    A3CLogManager.addConnection(name, details);
    A3CUI.UIsocket.emit('connectionDetails', A3CLogManager.getConnection(name));
    A3CUI.UIsocket.emit('connectionsList',   A3CLogManager.listConnections());
  }
  static getServerURL(){
    return A3CUI.UIhttpServerURL;
  }
}

exports.A3CUI = A3CUI;
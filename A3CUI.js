var http = require('http'),
fs = require('fs'),
UIhttpServer;

class A3CUI{
  static start(){
    UIhttpServer = http.createServer(A3CUI.clientRequest).listen(2802);
    console.log('UIhttpServer started');
  }

  static clientRequest(request, response){    
    var pageContent = require.resolve('./ressources/ui/index.html');
    response.end(fs.readFileSync(pageContent));
  }
}

exports.A3CUI = A3CUI;
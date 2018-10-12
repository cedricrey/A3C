var soap = require('soap'),
    A3CNLObject = require('./A3CNLObject').A3CNLObject
    xtkSessionWSDL = require.resolve('./wsdl/wsdl_xtksession.xml');

class A3CSession extends A3CNLObject {
  constructor ( options ){    
    options = options || {};
    options.wsdl = options.wsdl || xtkSessionWSDL;
    super( options );
  }

  Write( contentToSend ) {
   var promise = new Promise( (resolve, reject ) => {this.executeQueryResolve = resolve; this.executeQueryReject = reject;});
   var onLoaded = function( err, result, raw, soapHeader) {
          if(err)
            {
              this.executeQueryReject( err );
            }
              this.executeQueryResolve( result );
      }.bind(this)

    this.actionPromise.then(
    function( contentToSend ){
      this.client.Write({
        sessiontoken : this.a3cLogin.sessionToken,
        domDoc : {$xml : contentToSend} 
      },
        onLoaded
      )}.bind(this, contentToSend)
    );
    return promise;
  }  
}

exports.A3CSession = A3CSession;
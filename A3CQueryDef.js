var soap = require('soap'),
    A3CNLObject = require('./A3CNLObject').A3CNLObject;
    xtkQueryDefWSDL = require.resolve('./wsdl/wsdl_xtkquerydef.xml');

class A3CQueryDef extends A3CNLObject {
  constructor ( options ){    
    options = options || {};
    options.wsdl = options.wsdl || xtkQueryDefWSDL;
    super( options );
  }
  ExecuteQuery( query ){
    var promise = new Promise( (resolve, reject ) => {this.executeQueryResolve = resolve; this.executeQueryReject = reject;})
    var onLoaded = function( err, result, raw, soapHeader ){
      if( err )
      {
        this.executeQueryReject( err );
      }
      else
        {
          this.executeQueryResolve( result.pdomOutput );
        }
    }.bind( this );

    this.clientPromise.then(
    function( query ){
      this.client.ExecuteQuery({
        sessiontoken : this.a3cLogin.sessionToken,
        domDoc : {$xml : query} 
      },
        onLoaded
      )}.bind(this, query)
    );
    return promise;
  }
}

exports.A3CQueryDef = A3CQueryDef;
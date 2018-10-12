var soap = require('soap');
    xtkQueryDefWSDL = require.resolve('./wsdl/wsdl_xtkquerydef.xml');

 class  A3CNLObject {
  constructor ( options ){
    options = options || {};
    this.a3cLogin = options.a3cLogin || {};
    this.endpoint = this.a3cLogin.endpoint || "";
    this.wsdl = options.wsdl || xtkQueryDefWSDL;
    this.clientPromise = soap.createClientAsync( this.wsdl, {endpoint : this.endpoint} );
    this.clientPromise.then( function( client ){
        this.client = client;
        this.client.addHttpHeader('X-Security-Token', this.a3cLogin.securityToken);
        this.client.addHttpHeader('cookie',  "__sessiontoken=" + this.a3cLogin.sessionToken);
    }.bind( this ));
  }
}

exports.A3CNLObject = A3CNLObject;
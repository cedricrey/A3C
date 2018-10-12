var soap = require('soap');
    xtkSessionWSDL = require.resolve('./wsdl/wsdl_xtksession.xml');

function A3CLogin( options ){
  options = options || {};
  this.server = options.server || "";
  this.user = options.user || "";
  this.password = options.password || "";
  this.endpoint = this.server + "/nl/jsp/soaprouter.jsp";
  this.loginPromise = new Promise( (resolve, reject ) => {
    this.resolveLoginPromise = resolve;
    this.rejectLoginPromise = reject;
  });
}

A3CLogin.prototype.login = function( callBack ){  
  var onError = function( err ){
    console.log( err );
  };

  if( ! this.writePromise )
    {
      this.writePromise = soap.createClientAsync( xtkSessionWSDL, {endpoint : this.endpoint} );
    }
  this.writePromise.then(
     function(client){
      this.soapWriterClient = client;
      this.soapWriterClient.Logon({sessiontoken : "",
         strLogin :  this.user ,
         strPassword : this.password ,
         elemParameters : ""}, 
         this.onTokenLoaded.bind(this, callBack));
      }.bind( this )
    );
};
A3CLogin.prototype.onTokenLoaded = function(callBack, err, result, raw, soapHeader){
    
    if(err)
      {
      console.log("Error..." + err );
      this.rejectLoginPromise();
      reject();
      return
      }
    try{
      this.securityToken = result.pstrSecurityToken.$value;
    }
    catch ( e )
    {
      this.securityToken = "";
    }
    this.sessionToken = result.pstrSessionToken.$value;
    if(typeof callBack == "function")
      callBack();
    this.resolveLoginPromise();
};
A3CLogin.prototype.getTokens = function(){
  return {
    securityToken : this.securityToken,
    sessionToken : this.sessionToken,
    endpoint : this.endpoint    
  };
}
A3CLogin.prototype.getLoginPromise = function(){
  return this.loginPromise;
}

exports.A3CLogin = A3CLogin;
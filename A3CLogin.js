var soap = require('soap');
    xtkSessionWSDL = require.resolve('./wsdl/wsdl_xtksession.xml');

function A3CLogin( options ){
  options = options || {};
  this.server = options.server || "";
  this.user = options.user || "";
  this.password = options.password || "";
  this.endpoint = this.server + "/nl/jsp/soaprouter.jsp";
  //Just to avoid multiple login request
  this.loginRequested = false;
  this.loginPromise = new Promise( (resolve, reject ) => {
    this.resolveLoginPromise = resolve;
    this.rejectLoginPromise = reject;
  });
  this.writePromise = soap.createClientAsync( xtkSessionWSDL, {endpoint : this.endpoint} );
}

A3CLogin.prototype.login = function(){  
  //Just to avoid multiple login request
  this.loginRequested = true;
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
         this.onTokenLoaded.bind(this));
      }.bind( this )
    );
  return this.loginPromise;
};
A3CLogin.prototype.onTokenLoaded = function( err, result, raw, soapHeader){
    
    if(err)
      {
      console.log("Error..." + err );
      this.rejectLoginPromise( err );
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
    this.resolveLoginPromise( this.getTokens() );
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
//Just to avoid multiple login request
A3CLogin.prototype.isLoginRequested = function(){
  return this.loginRequested;
}
exports.A3CLogin = A3CLogin;
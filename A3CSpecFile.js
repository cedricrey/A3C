var soap = require('soap'),
    A3CNLObject = require('./A3CNLObject').A3CNLObject,
    JXON = require('jxon'),
    xtkSpecFile = require.resolve('./wsdl/wsdl_xtkspecFile.xml');

class A3CSpecFile extends A3CNLObject {
  constructor ( options ){    
    options = options || {};
    options.wsdl = options.wsdl || xtkSpecFile;
    super( options );
    this.clientPromise.then( function(){
      this.client.addSoapHeader({connection: 'keep-alive'});
    }.bind(this));
  }

  GenerateDoc( spec ) {
   var promise = new Promise( (resolve, reject ) => {this.executeQueryResolve = resolve; this.executeQueryReject = reject;});
   var onLoaded = function( err, result, raw, soapHeader) {
          if(err)
            {
              if( err.response.statusCode == 200 )
                {
                  try{
                    var jxonVersion = JXON.stringToJs(raw);
                    jxonVersion = jxonVersion['SOAP-ENV:Envelope']['SOAP-ENV:Body'].GenerateDocResponse.pdomPackage;
                    this.executeQueryResolve( [result, jxonVersion, raw, soapHeader] );
                  }
                  catch( e ){
                    console.log('A3CSpecFile.GenerateDoc() error on JXON', e);
                    this.executeQueryReject( { error : e, connector : this.a3cLogin.server, response : err.response.body });
                    //throw  e;          
                    return
                  }
                }
              else
              {
                this.executeQueryReject( { url : this.a3cLogin.endpoint, error : err, result, raw } );
                console.log('A3CSpecFile.GenerateDoc() error on result', err.body);
                //throw  {message : "A3CSpecFile.GenerateDoc() error on result", err};
                return
              }
              
            }
            try{
              var jxonVersion = JXON.stringToJs(raw);
              jxonVersion = jxonVersion['SOAP-ENV:Envelope']['SOAP-ENV:Body'].GenerateDocResponse.pdomPackage;
              this.executeQueryResolve( [result, jxonVersion, raw, soapHeader] );
            }
            catch( e ){
              console.log('A3CSpecFile.GenerateDoc() error on JXON', e);
              this.executeQueryReject( { error : e, connector : this.a3cLogin.server });   
              //throw {message : "A3CSpecFile.GenerateDoc() error on JXON", err};       
            }
      }.bind(this);

    this.clientPromise.then(
    function( spec ){
      //console.log("Got A3CLogin ? ", this.a3cLogin.sessionToken);
      this.client.GenerateDoc({
        sessiontoken : this.a3cLogin.sessionToken,
        domDoc : {$xml : spec} 
      },
        onLoaded,
        {forever : true}
      )}.bind(this, spec)
    );
    return promise;
  }  
}

exports.A3CSpecFile = A3CSpecFile;
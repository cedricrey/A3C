console.log('STart A3C');
exports.A3CLogManager = require('./A3CLogManager').A3CLogManager;
exports.A3CLogin =  require('./A3CLogin').A3CLogin;
exports.A3CQueryDef =  require('./A3CQueryDef').A3CQueryDef;
exports.A3CSession =  require('./A3CSession').A3CSession;
A3CUI =  require('./A3CUI').A3CUI;

console.log(A3CUI.start);
if( process.argv.indexOf('enableInterface') != -1 )
  A3CUI.start();
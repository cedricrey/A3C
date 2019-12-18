#!/usr/bin/env node
var A3CUI = require('./A3CUI').A3CUI;
A3CUI.start( {port:4545} );


var url = A3CUI.getServerURL();
var start = (process.platform == 'darwin'? 'open': process.platform == 'win32'? 'start': 'xdg-open');
require('child_process').exec(start + ' ' + url);
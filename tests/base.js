var chai = require("chai"),
    expect = chai.expect,
    core = require("./base.js"),
    fs = require("fs");

var Fiber = require('fibers');
var babel = require('babel');

console.log('Loading!');

// main = function() {
//   console.log('main', arguments);
//   return 'DAEMON';
// }

// process.argv[2] = process.cwd()+'/config.json';
// console.log('config.json:', process.argv);

var cwd = process.cwd();

// process.chdir('../.meteor/meteor/tools/server/');
// var boot = './boot.js';
// eval(fs.readFileSync(boot).toString());

var isobuildPath = '../.meteor/meteor/tools/';
process.chdir(isobuildPath);
var packageSource = './package-source.js';
// var code = fs.readFileSync(packageSource).toString();
// code = babel.transform(code, {}).code;
// code = code.replace(/require\('(.+)\.js'\)/g, 'require(\''+isobuildPath+'$1.js\')');
// eval(code);
PackageSource = require(isobuildPath+packageSource);

process.chdir(cwd);

var ps = new PackageSource();

new Fiber(function() {
  ps.initFromPackageDir('../.meteor/meteor/packages/meteor-platform', {});
}).run();

//console.log('Meteor', Meteor);

console.log('done!');
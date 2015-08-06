var chai = require("chai"),
    expect = chai.expect,
    core = require("./base.js"),
    fs = require("fs"),
    sinon = require('sinon'),
    sinonChai = require('sinon-chai');

chai.use(sinonChai);

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
// var code = fs.readFileSync(packageSource).toString();
// code = babel.transform(code, {}).code;
// code = code.replace(/require\('(.+)\.js'\)/g, 'require(\''+isobuildPath+'$1.js\')');
// eval(code);
PackageSource = require(isobuildPath+'./package-source.js');
buildmessage = require(isobuildPath+'./buildmessage.js');
ProjectContext = require(isobuildPath+'./project-context.js').ProjectContext;

process.setMaxListeners(0);
var endWorkflow = sinon.stub(buildmessage,'assertInCapture').returns(true);

new Fiber(function() {
  var projectContext = new ProjectContext({
    projectDir: './',
    releaseForConstraints: null
  });
  projectContext.readProjectMetadata();
  var ps = new PackageSource();
  ps.initFromAppDir(projectContext, {});
  console.log(Object.keys(global));
}).run();
process.chdir(cwd);



// var ps = new PackageSource();

// new Fiber(function() {
//   ps.initFromAppDir('../.meteor/meteor/packages/meteor-platform', {});
//   console.log('whoop', Object.keys(global));
// }).run();

//console.log('Meteor', Meteor);

console.log('done!');
var chai = require("chai");
    expect = chai.expect,
    core = require("./base.js"),
    fs = require("fs"),
    _ = require("underscore");

var Fiber = require("fibers");

function loadPackage(package, context, excludedPackages, visitedPackages, depth) {
  depth = depth || 0;
  function log(str) {
    console.log(Array(depth).join(' ')+str);
  }

  if (!visitedPackages) {
    visitedPackages = [];
  }
  if (_.contains(visitedPackages, package) ||
      _.contains(excludedPackages, package)) {
    return;
  }
  visitedPackages.push(package);

  Npm = {
    depends: function() {},
    strip: function() {},
    require: require
  };

  Cordova = {
    depends: function() {}
  };

  Package = {
    describe: function() {},
    registerBuildPlugin: function() {},
    onUse: function(callback) {
      var API = {
        imply: function(packageSpecs) {
          this._implies = this._implies.concat(packageSpecs);
        },
        use: function(packageNames, architecture, options) {
          var serverUse = true;
          if (_.isArray(architecture)) {
            serverUser = architecture.indexOf('server') !== -1;
          }
          if (serverUse) {
            this._uses = this._uses.concat(packageNames);
          }
        },
        export: function(exportedObject, architecture) {
          if (exportedObject && exportedObject.constructor == String) {
            exportedObject = [exportedObject];
          }

          var serverExport = false;
          if (architecture && architecture.constructor == String) {
            serverExport = architecture === 'server';
            architecture = [architecture];
          }
          else if (architecture && architecture.constructor == Array) {
            serverExport == architecture.indexOf('server') != -1 ||
                                  architecture.length == 0;
          }
          else if (architecture && architecture.constructor == Object) {
            serverExport = !architecture.testOnly;
          }

          if (serverExport) {
            // exportedObject.map(function(objectName) {
            //   // Export from closure scope to global scope
            //   global[objectName] = this[objectName];
            // });
            this._exports = this._exports.concat(exportedObject);
          }
        },
        addFiles: function(filename, architecture) {
          if (architecture && architecture.constructor == String) {
            architecture = [architecture];
          }
          var serverFile = !architecture ||
                             architecture.length === 0 ||
                             architecture.indexOf('server') !== -1;

          if (serverFile) {
            this._files = this._files.concat(filename);
          }
        },
        _implies: [],
        _uses: [],
        _exports: [],
        _files: [],
        _finish: function() {
          // Load implies to global scope
          this._implies.map(function(package) {
            loadPackage(package, global, excludedPackages, visitedPackages, depth+1);
          });

          // Load implies to global scope
          this._uses.map(function(package) {
            loadPackage(package, global, excludedPackages, visitedPackages, depth+1);
          });

          // Eval files
          this._files.map(function(filename) {
            if (_.last(filename.split('.')) !== 'js') {
              return;
            }
            log('evaling ' + filename);
            var filename = '../.meteor/meteor/packages/' + package + '/' + filename;
            eval(fs.readFileSync(filename).toString());
          });

          // Export references to global scope
          this._exports.map(function(objectName) {
            context[objectName] = this[objectName];
          });
        }
      };
      (function() {
        callback(API);
        API._finish();
      })();
    },
    onTest: function() {}
  };

  log('Loading ' + package);
  var packageJS = '../.meteor/meteor/packages/' + package + '/package.js';
  eval.bind(global)(fs.readFileSync(packageJS).toString());
}

__meteor_bootstrap__ = {
  startupHooks: [],
  serverDir: './',
  configJson: {} };
__meteor_runtime_config__ = { meteorRelease: "METEOR@MOCK" };

// var cwd = process.cwd();
// process.chdir('../.meteor/meteor/tools/server/');
// var boot = './boot.js';
// eval(fs.readFileSync(boot).toString());
// process.chdir(cwd);

Fiber(function () {
  loadPackage('meteor-platform', global, [
    'es5-shim',
    'isobuild:compiler-plugin@1.0.0'
  ]);
}).run();
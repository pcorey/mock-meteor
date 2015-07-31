var chai = require("chai");
    expect = chai.expect,
    core = require("./base.js"),
    fs = require("fs"),
    _ = require("underscore");

function loadPackage(package) {
  Npm = {
    depends: function() {},
    strip: function() {},
    require: require
  };

  Cordova = {
    depends: function() {}
  }

  Package = {
    describe: function() {},
    registerBuildPlugin: function() {},
    onUse: function(callback) {
      var API = {
        imply: function(packageSpecs) {
          if (typeof packageSpecs === 'string') {
            packageSpecs = [packageSpecs];
          }
          packageSpecs.map(loadPackage);
        },
        use: function(packageNames, architecture, options) {
          if (typeof packageNames === 'string') {
            packageNames = [packageNames];
          }
          if (typeof architecture === 'string') {
            architecture = [architecture];
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
            exportedObject.map(function(objectName) {
              // Export from closure scope to global scope
              global[objectName] = this[objectName];
            })
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
            console.log('  evaling ', filename);
            var filename = '../.meteor/meteor/packages/' + package + '/' + filename;
            eval(fs.readFileSync(filename).toString());
          }
        }
      };
      (function() {
        callback(API);
      })();
    },
    onTest: function() {}
  };

  console.log('Loading ', package);
  var packageJS = '../.meteor/meteor/packages/' + package + '/package.js';
  eval.bind(global)(fs.readFileSync(packageJS).toString());
}

loadPackage('meteor-platform');
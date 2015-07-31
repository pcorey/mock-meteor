var chai = require("chai");
    expect = chai.expect,
    core = require("./base.js");

Meteor = {
  _methods: {},
  methods: function(name, func) {
    Meteor._methods[name] = func;
  },
  call: function(name) {
    return Meteor._methods[name].apply(null, arguments.splice(1));
  }
};

visible = require('../tester').visible;
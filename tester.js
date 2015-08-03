if (Meteor.isClient) {
  // counter starts at 0
  Session.setDefault('counter', 0);

  Template.hello.helpers({
    counter: function () {
      return Session.get('counter');
    }
  });

  Template.hello.events({
    'click button': function () {
      // increment the counter when button is clicked
      Session.set('counter', Session.get('counter') + 1);
    }
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    Meteor.methods({
      test: function(a) {
        return 123;
      }
    });
  });
}


function visible() {
  return 1337;
}

/*

> process.argv
[ '/Users/pcorey/.meteor/packages/meteor-tool/.1.1.3.1wysac9++os.osx.x86_64+web.browser+web.cordova/mt-os.osx.x86_64/dev_bundle/bin/node',
  '/Users/pcorey/mock-meteor/.meteor/local/build/main.js',
  'program.json' ]

*/
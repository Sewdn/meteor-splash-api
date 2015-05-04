Package.describe({
  "summary": "Setup a splash page in front of your meteor app",
  "version": "0.1.0",
  "git": "https://github.com/Sewdn/meteor-splash-api.git",
  "name": "sewdn:splash-api"
});

Package.onUse(function(api) {
  api.versionsFrom('METEOR@0.9.3.1');

  var c = 'client',
      s = 'server',
      cs = [c,s];

  api.use([
    'meteorhacks:picker@1.0.2',
    //add fast-render to be able to access Meteor.userId from within route
    'meteorhacks:fast-render@2.3.2',
    'underscore'
  ], s);

  api.addFiles([
    'routes.js'
  ], s);

  api.export('Splash');
});

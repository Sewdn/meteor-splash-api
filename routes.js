var Splash = {
    publishUserFields: function(u) {
      var f;
      if(Meteor.users.fields && Meteor.users.fields.public) {
        f = Meteor.users.fields.public;
      } else {
        f = {
          profile: 1,
          username: 1
        };
      }
      return _.pick(u, _.keys(f));
    }
  },
  path = Npm.require('path'),
  fs = Npm.require('fs'),
  getRoutes = Picker.filter(function(req, res) {
    return req.method === "GET";
  }),
  jsonResponse = function(data, params, req, res, next) {
    var callback = (!! params.query.callback) ? params.query.callback : 'jsonp',
        extension = _.contains(['json','jsonp'], params.ext) ? params.ext : 'json';

    if(extension === 'jsonp'){
      res.writeHead(200, {'Content-Type': 'text/javascript'});
      res.end(callback + "(" + JSON.stringify(data, null, 2) + ")");
    }

    if(extension === 'json'){
      res.writeHead(200, {'Content-Type': 'text/json'});
      res.end(JSON.stringify(JSON.stringify(data)));
    }
  };

getRoutes.route('/session.:ext', function(params, req, res, next) {
  var u = Meteor.user(),
      response = {};

  if(u) {
    response = Splash.publishUserFields(u);
  } else {
    response = {response: 'not logged in'};
  }

  jsonResponse(response, params, req, res, next);
});

getRoutes.route('/app.:ext', function(params, req, res, next) {
  //find app assets in FS
  var browserDir = path.resolve('.').replace('server', 'web.browser');

  fs.readdir(browserDir, function(err, data){
    data = _.reduce(_.filter(data, function(file){
      return file.indexOf('css') > 0 || file.indexOf('js') > 0;
    }), function(memo, f){
      if(f.indexOf('css') > 0) {
        memo['css'] = f;
      } else if(f.indexOf('js') > 0 && f.indexOf('json') === -1){
        memo['js'] = f;
      }
      return memo;
    }, {});
    jsonResponse(data, params, req, res, next);
  });
});

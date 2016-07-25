/**
 * sessionAuth
 *
 * @module      :: Policy
 * @description :: Simple policy to allow any authenticated user
 *                 Assumes that your login action in one of your controllers sets `req.session.authenticated = true;`
 * @docs        :: http://sailsjs.org/#!/documentation/concepts/Policies
 *
 */
module.exports = function(req, res, next) {

    var route = req.url;
    var method = req.method;
    var groupId = req.user.groupId;

    var redirectString = getRedirect(method, route);

    var isAPI = checkIsAPI(route);
    var controller = getController(redirectString);
    var action = getAction(redirectString);

    var permissionService = new PermissionService();
    permissionService.hasPermission(groupId, isAPI, route, controller, action, method, function(err, result) {
        if (err || result.length == 0) {
            return res.forbidden('You are not autherized');
        } else {
            return next();
        }
    });
};

function getRedirect(method, route) {

    var routeString = method.toLowerCase() + " " + route;
    var redirect = "";

    _.map(sails.config.routes, function(value, key) {
        if (key === routeString) {
            redirect = value;
        }
    });

    return redirect;
}

function checkIsAPI(route) {
    return route.indexOf("/api/") == 0;
}

function getController(route) {
    return route.slice(0, route.indexOf("Controller"))
};

function getAction(route) {
    return route.split('.')[1];
}

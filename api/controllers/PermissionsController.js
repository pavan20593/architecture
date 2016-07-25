/**
 * PermissionsController
 *
 * @description :: Server-side logic for managing permissions
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

    update: function(req, res) {

        if (!req.body.groupId) {
            return res.badRequest('Invalid group id parameter');
        } else if (!req.body.moduleId) {
            return res.badRequest('Invalid module id parameter');
        } else if (!(req.body.create === undefined || req.body.update === undefined || req.body.remove === undefined || req.body.read === undefined)) {
            return res.badRequest('Invalid permission parameter');
        }

        var params = {
            moduleId: req.body.moduleId,
            groupId: req.body.groupId
        }

        if (req.body.id) {
            params.id = req.body.id;
        }

        if (req.body.create === true || req.body.create === false) {
            params.create = req.body.create;
        } else if (req.body.update === true || req.body.update === false) {
            params.update = req.body.update;
        } else if (req.body.remove === true || req.body.remove === false) {
            params.remove = req.body.remove;
        } else if (req.body.read === true || req.body.read === false) {
            params.read = req.body.read;
        }

        var permissionService = new PermissionService();
        permissionService.upsert(params, function(err, result) {
            if (err) {
                return res.badRequest(err);
            } else {
                return res.jsonx({
                    message: 'Permissions successfully updated'
                });
            }
        });
    },

    find: function(req, res) {

        var options = {}
        options.where = {};
        options.where.groupId = req.user.groupId;

        var permissionService = new PermissionService();
        permissionService.find(options, function(err, result) {
            if (err) {
                return res.badRequest(err);
            } else {
                return res.jsonx(result);
            }
        });
    }

};

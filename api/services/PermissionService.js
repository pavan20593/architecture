'use strict';

var PermissionRepository = require('../repositories/PermissionRepository.js');
var ModulesRepository = require('../repositories/ModulesRepository.js');

class PermissionService {

    find(params, callback) {

        getAllModules(function(err, modulesData) {
            if (!err || modulesData.length > 0) {
                getAllPermissions(params, function(err, permissionsData) {
                    if (!err || permissionsData.length > 0) {
                        appendModulesAndPermissions(modulesData, permissionsData, callback);
                    }
                });
            }
        });
    }

    upsert(params, callback) {
        var permissionRepository = new PermissionRepository();
        permissionRepository.upsert(params, callback);
    }

    hasPermission(groupId, isAPI, path, controller, action, method, callback) {

        var options = {};

        if (isAPI) {
            options.where = getOptionsForAPI(controller, action);
        } else {
            options.where = getOptionsForPath(path);
        }

        getModule(options, function(err, moduleData) {

            if (!err || moduleData.length > 0) {

                options.where = {};
                options.where.moduleId = moduleData.id;
                options.where.groupId = groupId;

                decideCRUD(options.where, method);

                var permissionRepository = new PermissionRepository();
                permissionRepository.find(options, callback);
            } else {
                callback('You are not autherized');
            }

        });

    }

}

module.exports = PermissionService;

function getOptionsForPermissions(moduleId, method) {
    return {
        moduleId: moduleId,
        method: method
    };
}

function getOptionsForPath(path) {
    return {
        path: path
    };
}

function getOptionsForAPI(controller, action) {
    return {
        controller: controller,
        action: action
    };
}

function getModule(options, callback) {
    var modulesRepository = new ModulesRepository();
    modulesRepository.find(options, callback);
}

function getAllModules(callback) {

    var options = {};

    var modulesRepository = new ModulesRepository();
    modulesRepository.findAll(options, callback);
}

function getAllPermissions(params, callback) {

    var options = {};
    options.where = params.where;

    var permissionRepository = new PermissionRepository();
    permissionRepository.findAll(options, callback);
}

function decideCRUD(where, method) {

    if (method == 'GET') {
        where.read = true;
    } else if (method == 'POST') {
        where.create = true;
    } else if (method == 'PUT') {
        where.update = true;
    } else if (method == 'DELETE') {
        where.remove = true;
    }

}

function appendModulesAndPermissions(modules, permissions, callback) {

    var resultantPermissions = [];

    _.map(modules, function(moduleItem) {

        var resultantPermissionsItem = {};
        resultantPermissionsItem.module = {};
        resultantPermissionsItem.module.id = moduleItem.id;
        resultantPermissionsItem.module.name = moduleItem.name;

        resultantPermissionsItem.module.permissions = {};

        _.map(permissions, function(permissionItem) {

            if (permissionItem.moduleId === moduleItem.id) {

                var permission = {};
                permission.id = permissionItem.id;
                permission.create = permissionItem.create;
                permission.read = permissionItem.read;
                permission.update = permissionItem.update;
                permission.remove = permissionItem.remove;

                resultantPermissionsItem.module.permissions = permission;

            }

        });

        resultantPermissions.push(resultantPermissionsItem);

    });

    callback(null, resultantPermissions);

}

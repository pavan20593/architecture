/**
 * ModulesController
 *
 * @description :: Server-side logic for managing modules
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

    create: function(req, res) {

        var params = req.body;

        var moduleService = new ModuleService();
        moduleService.save(params, function(err, result) {
            if (err) {
                return res.badRequest(err);
            } else {
                return res.jsonx(result);
            }
        });
    }

};

var express = require("express");
var router = express.Router();
var models = require("../models");
const passport = require("passport");
const jwtStrategry = require("../strategies/jwt");
passport.use(jwtStrategry);

/**
 *
 * @api {post} /groups Add a new group to the system
 * @apiName Create groups
 * @apiGroup Groups
 * @apiVersion  0.1.0
 *
 * @apiDescription This function requires admin role
 * 
 * @apiParam {String} name Name of the group
 *
 * @apiSuccess (200) {Integer} id Group ID
 * @apiSuccess (200) {String} name Group name
 *
 */
router.post("/", function(req, res, next) {
  passport.authenticate("jwt", { session: false }, async (error, user) => {
    if (!user) {
      return res.status(401).json({ error: "You need to be authenticated" });
    }

    if (!user.role == "ADMIN") {
      return res.status(401).json({ error: "You need to be ADMIN" });
    }

    const name = req.body.name;

    const { Group } = models;

    try {
      const group = await Group.register({ name });

      return res.status(200).json({id:group.id,name:group.name});
    } catch (e) {
      return res.status(401).json({ error: e.message });
    }
  })(req, res, next);
});

/**
 *
 * @api {get} /groups Get list of available groups
 * @apiName Get groups
 * @apiGroup Groups
 * @apiVersion  0.1.0
 *
 *
 * @apiSuccess (200) {Object[]} groups Group list
 * @apiSuccess (200) {Integer} id Group ID
 * @apiSuccess (200) {String} name Group name
 *
 */
router.get("/", function(req, res, next) {
  passport.authenticate("jwt", { session: false }, async (error, user) => {
    if (!user) {
      return res.status(401).json({ error: "You need to be authenticated" });
    }

    const { Group } = models;

    try {
      const groups = await Group.findAll({ attributes: ["id", "name"] });

      return res.status(200).json(groups);
    } catch (e) {
      return res.status(400).json({ error: e.message });
    }
  })(req, res, next);
});

module.exports = router;

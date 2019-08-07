var express = require("express");
var router = express.Router();
var models = require("../models");
const bcrypt = require("bcrypt");
const passport = require("passport");
const jwtStrategry = require("../strategies/jwt");
passport.use(jwtStrategry);

/**
 *
 * @api {get} /users Get list of users
 * @apiName GetUsers
 * @apiGroup Users
 * @apiVersion  0.1.0
 *
 * @apiSuccess (200) {Object[]} users List of users
 * @apiSuccess (200) {String} users.id User's id
 * @apiSuccess (200) {String} users.name User's name
 * @apiSuccess (200) {String} users.email User's email
 *
 */
router.get("/", function(req, res, next) {
  passport.authenticate("jwt", { session: false }, (error, user) => {
    if (!user) {
      return res.status(401).json({ error: "You need to be authenticated" });
    }

    const { User } = models;

    User.findAll({ attributes: ["id", "name", "email"] }).then(users => {
      return res.status(200).json({users});
    });
  })(req, res, next);
});

/**
 *
 * @api {post} /users/login Login
 * @apiName Login
 * @apiGroup Users
 * @apiVersion  0.1.0
 *
 * @apiParam {String} email Email of user
 * @apiParam {String} password Password of user
 * 
 * @apiSuccess (200) {String} token Authorization token
 * @apiSuccess (200) {Integer} id User id
 *
 * @apiError (400) EmailRequiredError Email is required
 * @apiError (400) PasswordRequiredError Password is required
 * @apiError (400) InvalidInputError Email or password are incorrect
 *
 */
router.post("/login", function(req, res, next) {
  const { email, password } = req.body;

  const { User } = models;

  if (!email) {
    return res.status(400).json({
      error: "Email is required"
    });
  }

  if (!password) {
    return res.status(400).json({
      error: "Password is required"
    });
  }

  User.findOne({ where: { email } })
    .then(user => {
      if (!user.verifyPassword(password)) {
        return res.status(400).json({ error: "Invalid email or password" });
      }

      const token = user.generateJWT();
      return res.status(200).json({ id:user.id, token });
    })
    .catch(() => res.status(400).json({ error: "Invalid email or password" }));
});

/**
 *
 * @api {get} /users/me  Get current user information
 * @apiName CurrentUser
 * @apiGroup Users
 * @apiVersion  0.1.0
 *
 * 
 * @apiSuccess (200) {String} email Email of the current user
 * @apiSuccess (200) {Integer} id ID of current user
 * @apiSuccess (200) {Object[]} groups Groups that the user belongs to
 *
 */
router.get("/me", function(req, res, next) {
  passport.authenticate("jwt", { session: false }, async (error, user) => {
    if (!user) {
      return res.status(401).json({ error: "You need to be authenticated" });
    }
    try {
      const { User } = models;

      const { id, email, groups } = await User.findByPk(user.id, {
        include: "groups"
      });

      const groupNames = groups.map(group => {
        return { id: group.id, name: group.name };
      });

      return res.status(200).json({ email, id, groups: groupNames });
    } catch (e) {
      return res.status(400).json({ error: e.message });
    }
  })(req, res, next);
});

/**
 *
 * @api {get} /users/me/channels Get list of own channels
 * @apiName GetMyChannels
 * @apiGroup Users
 * @apiVersion  0.1.0
 *
 * @apiSuccess (200) {Object[]} channels List of channels
 * @apiSuccess (200) {Integer} channels.id ID of channel
 * @apiSuccess (200) {String} channels.root Root of channel
 * @apiSuccess (200) {Boolean} channels.restricted Indicates if the channel is restricted or not
 * @apiSuccess (200) {Integer} [channels.schemaId] ID of the schema that the channel follows.
 * @apiSuccess (200) {String} [channels.secret] Secret password to protect the channel (Not given if the channel is restricted)
 * @apiSuccess (200) {String} channels.cretedAt Date when the channel was created
 * @apiSuccess (200) {Object[]} channels.permissionedUsers List of users with permission to read this channel
 * @apiSuccess (200) {Integer} channels.permissionedUsers.id ID of the user
 * @apiSuccess (200) {String} channels.permissionedUsers.name Name of the user
 * @apiSuccess (200) {String} channels.permissionedUsers.email Email of the user
 * @apiSuccess (200) {Object[]} channels.permissionedGroups List of user groups with permission to read a referenced message of this channel
 * @apiSuccess (200) {Integer} channels.permissionedGroups.id ID of the group
 * @apiSuccess (200) {String} channels.permissionedGroups.name Name of the group
 */
router.get("/me/channels", function(req, res, next) {
  passport.authenticate("jwt", { session: false }, async (error, user) => {
    if (!user) {
      return res.status(401).json({ error: "You need to be authenticated" });
    }

    try {      
      const id = user.id
      const { User, Channel, PermissionUserChannel, PermissionGroupChannel, Group } = models;

      const channels = await Channel.findAll({where:{userId:user.id}})

      let channelsArray = []


      channelsArray = await Promise.all(channels.map(async channel=>{
        const {id,root,secret,restricted,schemaId,createdAt} = channel

        let secretToSend
        if(!restricted){
          secretToSend = secret
        }

        const permissionedUsers = await PermissionUserChannel.findAll({where:{channelId:channel.id},include:{model:User, attributes:["id","name","email"]}})
        const permissionedUsersInfo = permissionedUsers.map(perUser => perUser.User)

        const permissionedGroups = await PermissionGroupChannel.findAll({where:{channel_id:channel.id},include:{model:Group, attributes:["id","name"]}})
        const permissionedGroupsInfo = permissionedGroups.map(perGroup => perGroup.Group)
      
        return {id,root,secret : secretToSend,restricted,schemaId : schemaId || undefined,permissionedUsers: permissionedUsersInfo,permissionedGroups: permissionedGroupsInfo,createdAt}
      }))
            
      return res.status(200).json({ channels: channelsArray });
      
    } catch (e) { 

      return res.status(400).json({ error: e.message });
    }
  })(req, res, next);
});

/**
 *
 * @api {put} /users/:id/groups  Set groups that a user belongs to
 * @apiName Set user groups
 * @apiGroup Users
 * @apiVersion  0.1.0
 * 
 * @apiDescription This function requires admin role
 *
 * @apiParam (Path param) {Integer} id Id of the user
 * 
 * @apiSuccess (200) {Object[]} groups List of groups that the user belongs to
 * @apiSuccess (200) {Integer} id ID of the group
 * @apiSuccess (200) {String} Name of the group
 *
 * @apiError (403) Forbidden Admin role is needed
 * @apiError (400) GroupsRequired List of groups to be assigned is required.
 *
 */
router.put("/:id/groups", function(req, res, next) {
  passport.authenticate("jwt", { session: false }, (error, user) => {
    const { User, Group } = models;
    if (!user) {
      return res.status(401).json({ error: "You need to be authenticated" });
    }

    if (user.role !== "ADMIN") {
      return res.status(403).json({ error: "You need admin role" });
    }

    const id = req.params["id"];

    User.findByPk(id).then(user => {
      const reqGroups = req.body["groups"];

      if (!reqGroups) {
        return res
          .status(400)
          .json({ error: "Groups is a required parameter" });
      }

      Group.findAll({ where: { id: reqGroups } }).then(groups => {
        
        user.setGroups(groups).then(joinedUserGroups => {
          const groupNames = groups.map(group => {return {id:group.id,name:group.name}});
          return res.status(200).json({ groups: groupNames });
        });
      });
    });
  })(req, res, next);
});

/**
 *
 * @api {get} /users/:id/groups  Get groups that a user belongs to
 * @apiName Get user groups
 * @apiGroup Users
 * @apiVersion  0.1.0
 *
 * @apiParam (Path param) {Integer} id Id of the user
 *
 * @apiSuccess (200) {String[]} Groups  Array of groups that the user belongs to
 *
 * @apiError (404) Forbidden Admin role is needed
 *
 */
router.get("/:id/groups", function(req, res, next) {
  passport.authenticate("jwt", { session: false }, (error, user) => {
    const { User, Group } = models;
    if (!user) {
      return res.status(401).json({ error: "You need to be authenticated" });
    }

    if (user.role !== "ADMIN") {
      return res.status(404).json({ error: "You need admin role" });
    }

    const id = req.params["id"];

    User.findByPk(id, { include: "groups" }).then(user => {

      const groups = user.groups.map(group => group.name);

      return res.status(200).json({ groups });
    });
  })(req, res, next);
});

/**
 *
 * @api {post} /users/register Register
 * @apiName Register
 * @apiGroup Users
 * @apiVersion  0.1.0
 *
 * @apiParam {String} email Email of user
 * @apiParam {String} password Password of user
 * @apiParam {String} name Name of user
 * 
 * @apiSuccess (200) {Integer} id User id
 * @apiSuccess (200) {String} email User email
 * @apiSuccess (200) {String} name User name
 *
 * @apiError (400) EmailRequiredError Email is required
 * @apiError (400) PasswordRequiredError Password is required
 * @apiError (400) NameRequiredError Name is required
 *
 */
router.post("/register", function(req, res, next) {
  const { name, email, password } = req.body;

  if (!name) {
    return res.status(422).json({
      error: "Name is required"
    });
  }
  if (!email) {
    return res.status(422).json({
      error: "Email is required"
    });
  }

  if (!password) {
    return res.status(422).json({
      error: "Password is required"
    });
  }

  const { User } = models;

  User.register({
    name,
    email,
    password
  })
    .then(user =>
      res.status(201).json({ id:user.id, name: user.name, email: user.email },
        
      )
    )
    .catch(error =>
      res.json({
        error: true,
        data: {},
        error: error.message
      })
    );
});

router.get(
  "/protected",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    return res.status(200).send("YAY! this is a protected Route");
  }
);

router.get("/protected2", function(req, res, next) {

  passport.authenticate("jwt", { session: false }, (error, user) => {
    if (!user) {
      return res.status(401).json({ error: "You need to be authenticated" });
    }
    return res.status(200).send("YAY! this is a protected Route" + user.email);
  })(req, res, next);
});
module.exports = router;

var express = require("express");
var router = express.Router();
var models = require("../models");
const bcrypt = require("bcrypt");
const SALT_ROUNDS = 12;
const passport = require("passport");
const jwtStrategry = require("../strategies/jwt");
passport.use(jwtStrategry);

const iotaSeed = require("iota-seed");
const Mam = require("@iota/mam");
const { asciiToTrytes, trytesToAscii } = require("@iota/converter");
const { publish, initMAMState, fetchFromRoot } = require("../mam");
const {
  hash,
  encryptObject,
  decryptObject,
  generateSecret
} = require("../utilities/encryption");
const validateMessage = require("../utilities/validation");

/**
 *
 * @api {post} /channels Create channel
 * @apiName Create channel
 * @apiGroup Channels
 * @apiVersion  0.1.0
 *
 * @apiParam {String} description Description of the channel
 * @apiParam {Integer[]} permissions List of IDs of users that can read this channel
 * @apiParam {Integer[]} permissionGroups List of IDs of group that can be allowed to read certain messages of this channel
 * @apiParam {String} [secret] Secret password used to secure the channel </br><b>(Not indicating a secret will make the channel restricted)</b>
 * @apiParam {String} [schema] URL of the schema that the messages of the channel must follow
 *
 * @apiSuccess (200) {String} root Root of the first message in the channel
 * @apiSuccess (200) {String} [secret] Secret of the channel (Not given if channel is restricted)
 * @apiSuccess (200) {Integer} owner ID of the owner of the channel
 * @apiSuccess (200) {String} seed Seed used to generate the channel. </br><b>The seed is needed to attach messages to the channel. Cannot be recovered</b>.
 * @apiSuccess (200) {String} channelId ID of the channel inside the gateway
 * @apiSuccess (200) {String} nextRoot Root of the following message in the channel
 * @apiSuccess (200) {Boolean} restricted Indicates if the channel is restricted or not.
 * @apiSuccess (200) {Object[]} permissionedUsers List of users with permission to read this channel
 * @apiSuccess (200) {Integer} permissionedUsers.id ID of the user
 * @apiSuccess (200) {String} permissionedUsers.name Name of the user
 * @apiSuccess (200) {String} permissionedUsers.email Email of the user
 * 
 * 
 */
router.post("/", function(req, res, next) {
  try {
    passport.authenticate("jwt", { session: false }, async (error, user) => {
      if (!user) {
        return res.status(401).json({ error: "You need to be authenticated" });
      }

      

      // Parameters given by the user
      const permissions = req.body.permissions;
      const description = req.body.description;
      const permissionGroups = req.body.permissionGroups;
      const schema = req.body.schema; //Optional
      let secret = req.body.secret; //Optional

      let restricted = secret ? false : true; // If secret is not given, channel is restricted
      //TODO: Add delegated permissions

      const { Schema, PermissionUserChannel, User, Group } = models;

      let schemaObject;
      // Check that schema exists in DB
      if (schema) {
        const schemaArray = schema.split("/");
        const schemaName = schemaArray[schemaArray.length - 1];
        schemaObject = await Schema.findOne({
          where: { name: schemaName }
        });

        if (!schemaObject) {
          return res.status(401).json({ error: "Schema not found" });
        }
      }

      let permissionGroupNames

      if(permissionGroups){
        // Getting group names
        permissionGroupNames = await Group.findAll({
        attributes: ["id", "name"],
        where: { id: permissionGroups }
      });

      }
      
      // If channel is restricted we generate the secret
      if (restricted) {
        //TODO: Generate secret
        secret = generateSecret(3);
      }

      const seed = iotaSeed();

      const hashedSeed = await bcrypt.hash(seed, SALT_ROUNDS);

      // Init MAM state
      const mamState = await initMAMState(seed, secret);

      const timestamp = new Date();

      // First message of the created mam channel
      const firstMessage = {
        owner: user.id,
        description,
        schema,
        permissions,
        permissionGroups: permissionGroupNames,
        timestamp
      };

      const message = await publish(mamState, firstMessage);

      const root = message.root;
      const nextRoot = message.state.channel.next_root;
      const lastIndex = 0;

      const { Channel, Message } = models;

      let schemaId = undefined;

      if (typeof schemaObject !== "undefined") {
        schemaId = schemaObject.id;
      }
      //Saving channel info
      Channel.register({
        root,
        secret,
        userId: user.id,
        seed: hashedSeed,
        root,
        nextRoot,
        lastIndex,
        restricted,
        schemaId
      }).then(async channel => {
       

        if(permissionGroups){
          try {
            const groups = await Group.findAll({
              where: { id: permissionGroups }
            });
  
            // Setting groups that has permissions of this channel
            await channel.setPermissionedGroups(groups);
  
          
          } catch (e) {
            console.log(e);
            return res.status(401).json({ error: e.message });
          }
        }        

        const { id, root, secret, userId: owner } = channel;

        // Inserting first message into the DB
        const message = Message.register({ root, index: 0, channelId: id });

        if (!message) {
          console.log("Message was not inserted in DB");
        }

        // Registering users that have permissions to read the channel       
        const permissionUsers = await User.findAll({
          where: { id: permissions }
        });
        await channel.setPermissionedUsers(permissionUsers);

        // Getting only necessary info to
        const permissionUserNames = permissionUsers.map(user => {
          return { id: user.id, name: user.name, email: user.email };
        });

        return res.status(200).json({
          root,
          secret: restricted ? undefined : secret,
          owner,
          seed,
          channelId: id,
          nextRoot,
          schema,
          restricted,
          permissions: permissionUserNames,
          permissionGroups: permissionGroupNames
        });
      });
    })(req, res, next);
  } catch (e) {
    console.log("Error: " + e);
    return res.status(400).json({ error: e.message });
  }
});

/**
 *
 * @api {get} /channels/:id Get channel
 * @apiName GetChannel
 * @apiGroup Channels
 * @apiVersion  0.1.0
 *
 * 
 * @apiSuccess (200) {Integer} id ID of channel
 * @apiSuccess (200) {String} root Root of channel
 * @apiSuccess (200) {Boolean} restricted Indicates if the channel is restricted or not
 * @apiSuccess (200) {Integer} [schemaId] ID of the schema that the channel follows.
 * @apiSuccess (200) {String} [secret] Secret password to protect the channel (Not given if the channel is restricted)
 * @apiSuccess (200) {String} createdAt Date when the channel was created
 * @apiSuccess (200) {Object[]} permissionedUsers List of users with permission to read this channel
 * @apiSuccess (200) {Integer} permissionedUsers.id ID of the user
 * @apiSuccess (200) {String} permissionedUsers.name Name of the user
 * @apiSuccess (200) {String} permissionedUsers.email Email of the user
 * @apiSuccess (200) {Object[]} permissionedGroups List of user groups with permission to read a referenced message of this channel
 * @apiSuccess (200) {Integer} permissionedGroups.id ID of the group
 * @apiSuccess (200) {String} permissionedGroups.name Name of the group
 * 
 * @apiError InvalidChannelID The channel with specified ID does not exist
 */
router.get("/:id", function(req, res, next) {
  passport.authenticate("jwt", { session: false }, async (error, user) => {
    if (!user) {
      return res.status(401).json({ error: "You need to be authenticated" });
    }

    try {
      const { Channel, PermissionUserChannel, PermissionGroupChannel,User,Group } = models;

    const id = req.params["id"];

    const channel = await Channel.findByPk(id,{include:["owner"]});

    if (!channel) {
      return res.status(400).json({ error: "Channel does not exist" });
    }

    const { root, secret,restricted, schemaId } = channel;

    let secretToSend
    if(channel.owner.id == user.id){
      secretToSend = secret
    }

    const permissionedUsers = await PermissionUserChannel.findAll({where:{channelId:channel.id},include:{model:User, attributes:["id","name","email"]}})
    const permissionedUsersInfo = permissionedUsers.map(perUser => perUser.User)

    const permissionedGroups = await PermissionGroupChannel.findAll({where:{channel_id:channel.id},include:{model:Group, attributes:["id","name"]}})
    const permissionedGroupsInfo = permissionedGroups.map(perGroup => perGroup.Group)

   
    
    return res
      .status(200)
      .json({id, root, schemaId: schemaId || undefined, secret:secretToSend,restricted, permissionedUsers: permissionedUsersInfo,permissionedGroups:permissionedGroupsInfo });
      
    } catch (e) {
      return res.status(400).json({error: e.message})
    }
    
  })(req, res, next);
});

/**
 *
 * @api {get} /channels/:id/messages/:root Get message from a channel
 * @apiName Get message from channel
 * @apiGroup Messages
 * @apiVersion  0.1.0
 *
 * @apiParam (Path params) {Integer} id ID of the channel to be consulted
 * @apiParam (Path params) {String} root Root of the message to be consulted
 * @apiParam {String} [secret] Password used to secure the channel
 *
 * @apiSuccess {Object} data Message inserted in the channel
 *
 * @apiError (400) {String} message Error message
 *
 */
router.get("/:id/messages/:root", function(req, res, next) {
  passport.authenticate("jwt", { session: false }, async (error, user) => {
    if (!user) {
      return res.status(401).json({ error: "You need to be authenticated" });
    }

    const id = req.params["id"];
    const reqRoot = req.params["root"];
    const reqSecret = req.body.secret;

    if (!reqRoot) {
      return res.status(401).json({ error: "Root is mandatory" });
    }

    const { Channel, Message } = models;

    Channel.findByPk(id, { include: ["owner", "permissionedUsers"] }).then(
      async channel => {

        if (!channel) {
          return res.status(401).json({ error: "Channel does not exist" });
        }

        const { id, secret, owner, permissionedUsers, restricted } = channel;

        const permissionedUsersId = permissionedUsers.map(user => {
          return user.id;
        });

        // Checking if the channel is restricted
        if (!restricted) {
          // Checking if given secret is correct
          if (secret !== reqSecret) {
            return res
              .status(401)
              .json({ error: "Given secret is not channel's secret" });
          }
        }


        let messageDB
        try{
          // Getting message from database
          messageDB = await Message.findOne({
          where: { root: reqRoot, channelId: id },
          include: "permissionedUsers"
        });

        }catch(e){
          return res
              .status(401)
              .json({ error: "Given root doesn't belong to the channel" });
        }
        

        if(!messageDB){
          return res
              .status(401)
              .json({ error: "Given root doesn't belong to the channel" });
          
        }

        // Users that have permission to access this specific message
        const messagePermissionedUsersIds = messageDB.permissionedUsers.map(
          user => user.id
        );

        // Check if user requesting has permission for this channel
        if (
          !(
            permissionedUsersId.includes(user.id) ||
            owner.id == user.id ||
            messagePermissionedUsersIds.includes(user.id)
          )
        ) {
          //User does not have permission
          if (!restricted) {
            //Getting message from the tangle without decrypting
            const message = await fetchFromRoot(reqRoot, secret);
            const messageObject = JSON.parse(message);

            // Returning message encrypted
            return res.status(200).json({
              data: {
                message: messageObject,
                owner: { name: owner.name, email: owner.email }
              }
            });
          } else {
            return res.status(401).json({
              error: "You do not have permissions to read this message. This channel is restriced."
            });
          }
        } else {
          // User has permissions
          const message = await fetchFromRoot(reqRoot, secret);
          const messageObject = JSON.parse(message);

          try {
            await decryptObject(messageObject, messageDB.id);
          } catch (e) {
            console.log(e);
          }

          return res.status(200).json({
            data: {
              message: messageObject
            }
          });
        }
      }
    );
  })(req, res, next);
});


/**
 *
 * @api {post} /channels/:id/messages Post message in channel
 * @apiName Post message in channel
 * @apiGroup Channels
 * @apiVersion  0.1.0
 *
 * @apiParam (Path params) {Number} id ID of the channel where the message will be inserted
 *
 * @apiParam {String} seed Seed of the channel
 * @apiParam {Object} message Message to be inserted in the tangle in JSON format
 * @apiParam {String} [secret] Password used to secure the channel
 * @apiParam {Object} [referece] Message of other channel that this message is referencing
 * 
 * @apiError Forbidden You have to be the owner of the channel to post a message
 * @apiError BadSeedError Provided seed is not channel's seed
 * @apiError BadSecretError Provided secret is not channel's secret
 * 
 */
router.post("/:id/messages", function(req, res, next) {
  passport.authenticate("jwt", { session: false }, async (error, user) => {
    if (!user) {
      return res.status(401).json({ error: "You need to be authenticated" });
    }

    const id = req.params["id"];

    const {
      seed: reqSeed,
      secret: reqSecret,
      message: reqMessage,
      reference: reqReference
    } = req.body;

    try {
      const { Channel, Message, EncryptedData,User } = models;

      Channel.findByPk(id, {
        include: ["owner", "schema", "permissionedUsers","permissionedGroups"]
      })
        .then(async channel => {
          

          const {
            id,
            secret,
            owner,
            seed: hashedSeed,
            lastIndex,
            nextRoot,
            schema,
            restricted,
            permissionedUsers: permissionedCurrentChannelUsers,
            permissionedGroups
          } = channel;

          // Checking ownership of channel
          if (owner.id !== user.id) {
            return res
              .status(403)
              .json({ error: "You are not the owner of this channel" });
          }

          // Checking seed of the channel
          if (!bcrypt.compareSync(reqSeed, hashedSeed)) {
            return res
              .status(403)
              .json({ error: "Given seed is not channels seed" });
          }

          // Checking if restricted
          if (!restricted) {
            // Checking secret of channel
            if (reqSecret !== secret) {
              return res
                .status(403)
                .json({ error: "Incorrect channel secret provided" });
            }
          }

          let encryptedInfo = []; // Array that contains the info that need to be inserted in the DB after message is created

          let message = { ...reqMessage }; //Duplicating the message

          //Check if the channel has a schema to follow
          if (schema) {
            const { valid, errors, fieldsToEncrypt } = validateMessage(
              schema.name,
              message
            );

            // Message does not follow the schema
            if (!valid) {
              return res.status(403).json({ error: errors });
            }

            // Check encrypted fields in the schema
            if (fieldsToEncrypt) {
             
              [message, encryptedInfo] = encryptObject(
                reqMessage,
                fieldsToEncrypt
              );
            
             
            }
          }

          //Init mam state

          let mamState = await initMAMState(reqSeed, secret);

          mamState = Mam.changeMode(mamState, "restricted", secret);

          //Update mam state to post message in the last root
          const newIndex = parseInt(lastIndex) + 1;
          mamState.channel.next_root = nextRoot;
          mamState.channel.start = newIndex;

          const messageState = await publish(mamState, message);
          const messageRoot = messageState.root;

       

          //Inserting message in the DB
          const messageDB = await Message.register({
            root: messageRoot,
            index: newIndex,
            channelId: id
          });

          if (!messageDB) {
            console.log("Message was not inserted in DB");
          }

          // Check if message has a reference
          if (reqReference) {

            const { channel: channelId, root: refRoot } = reqReference;
            const refChannel = await Channel.findByPk(channelId, {
              include: ["permissionedUsers","permissionedGroups"]
            });

            if (!refChannel) {
              return res
                .status(401)
                .json({ error: "Referenced channel does not exist." });
            }

            // Check if current user has permission to make a reference to refChannel. 
            const permissionedUsersRefChannel = refChannel.permissionedUsers.map(
              user => user.id
            );
            
            if (!permissionedUsersRefChannel.includes(user.id)) {
              return res
                .status(401)
                .json({
                  error:
                    "You don't have permission to reference the indicated channel."
                });
            }

            // Getting message to be referenced
            const refMessage = await Message.findOne({
              where: { root: refRoot }
            });

            if (!refMessage) {
              return res
                .status(401)
                .json({
                  error: "Given root was not found in specified channel"
                });
            }

            // User with permissions on the current channel. These users will be allowed to read refMessage
            const usersToPermit = permissionedCurrentChannelUsers.map(user => user.id); 

            // Groups that usersToPermit have to belong to
            const allowedGroups = refChannel.permissionedGroups.map(group=>group.id)

            if(!allowedGroups.length){
              return res.status(401).json({error: "The specified message cannot be referenced. Channel doesn't have permission group"})
            }

            

            usersToPermit.forEach(async userId => {
              try {

                const user = await User.findByPk(userId,{include:["groups"]})

                const userGroups = user.groups.map(group=>group.id)

                //Checking if any of user group is in allowed groups
                const intersection = userGroups.filter(function(n) {
                  return allowedGroups.indexOf(n) > -1;
                });

                if(!intersection.length){
                  return res.status(401).json({error: "Readers of this channel are not allowed to read referenced channel"})
                }else{
                  await refMessage.addPermissionedUser(userId);
                }
                            
              } catch (e) {
                console.log(e);
              }
            });

            
          }

          // Insert fields in the encryption table
          encryptedInfo.forEach(async info => {
            await EncryptedData.register({
              messageId: messageDB.id,
              ...info
            });
          });

          // Update next_root and last_index in the database
          channel
            .update({
              nextRoot: messageState.next_root,
              lastIndex: newIndex
            })
            .then(() => {
              let secretToSend;
              if (!restricted) {
                secretToSend = secret;
              }

              return res.status(200).json({
                data: {
                  id,
                  secret: secretToSend,
                  root: messageRoot,
                  owner: { name: owner.name, email: owner.email }
                }
              });
            })
            .catch(error => {
              console.log("Error updating attributes: " + error);
            });
        })
        .catch(error => console.log("Errour: " + error));
    } catch (err) {
      console.log(err);
      return res.status(403).json({ error: err.message });
    }
  })(req, res, next);
});

module.exports = router;

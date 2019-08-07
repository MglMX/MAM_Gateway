var express = require("express");
var router = express.Router();
var models = require("../models");
const passport = require("passport");
const jwtStrategry = require("../strategies/jwt");
passport.use(jwtStrategry);
const fs = require("fs");

/**
 *
 * @api {post} /schemas Add a new schema to the system
 * @apiName Create schemas
 * @apiGroup Schemas
 * @apiVersion  0.1.0
 *
 * @apiParam {String} name Name of the schema
 * @apiParam {Object} schema JSON schema
 * 
 * @apiSuccess (200) {Integer} id Schema ID
 * @apiSuccess (200) {String} name Schema name
 * 
 * @apiError (400) ExisitinSchemaError Schema with this name already exists
 *
 */
router.post("/", function(req, res, next) {
  passport.authenticate("jwt", { session: false }, async (error, user) => {
    if (!user) {
      return res.status(401).json({ error: "You need to be authenticated" });
    }
    try {
      let name = req.body.name;
      const schema = req.body.schema;

      const { Schema } = models;
      
      const extension = name.includes(".json") ? "" : ".json"

      name = name + extension

      const existingSchema = await Schema.findOne({where:{name}})

      if(existingSchema){
        return res.status(400).json({ error: "Schema with this name already exists" });
      }

      fs.writeFileSync(
        __dirname + "/../schemas/" + name,
        JSON.stringify(schema,null,2),
        "utf8",
        function(err) {
          if (err) {
            console.log("An error occured while writing schema to File.");
            return console.log(err);
          }

        }
      );

      const schemaObject = await Schema.register({ name });

      return res.status(200).json({id:schemaObject.id, name});
    } catch (e) {
      console.log(e)
      return res.status(400).json({ error: e.message });
    }
  })(req, res, next);
});

/**
 *
 * @api {get} /schemas Get list of available schemas
 * @apiName Get schemas
 * @apiGroup Schemas
 * @apiVersion  0.1.0
 *
 * @apiSuccess (200) {Object[]} schemas List of schemas
 * @apiSuccess (200) {Integer} schemas.id Schema ID
 * @apiSuccess (200) {String} schemas.name Schema name
 *
 * 
 *
 */
router.get("/", function(req, res, next) {
  passport.authenticate("jwt", { session: false }, async (error, user) => {
    if (!user) {
      return res.status(401).json({ error: "You need to be authenticated" });
    }
    const { Schema } = models;

    const schemas = await Schema.findAll({attributes:["id","name"]})

    return res.status(200).json({schemas})

  })(req, res, next);
});

/**
 *
 * @api {get} /schemas/:name Get schema
 * @apiName Get schema
 * @apiGroup Schemas
 * @apiVersion  0.1.0
 *
 *
 * @apiSuccess (200) {Integer} schemas.id Schema ID
 * @apiSuccess (200) {String} schemas.name Schema name
 *
 */
router.get("/:name", function(req, res, next) {
  passport.authenticate("jwt", { session: false }, async (error, user) => {
    if (!user) {
      return res.status(401).json({ error: "You need to be authenticated" });
    }

    let name = req.params["name"]

    const extension = name.includes(".json") ? "" : ".json"
    name = name + extension

    const { Schema } = models;

    const schemaExists = await Schema.findOne({where : {name}})

    if(schemaExists){
      const schema = fs.readFileSync(__dirname + "/../schemas/" + name,'utf8')

      return res.status(200).json({schema: JSON.parse(schema)})
    }else{
      return res.status(401).json({ error: "Schema does not exist" });
    }


  })(req, res, next);
});

module.exports = router;

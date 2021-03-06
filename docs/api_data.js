define({ "api": [
  {
    "type": "post",
    "url": "/channels",
    "title": "Create channel",
    "name": "Create_channel",
    "group": "Channels",
    "version": "0.1.0",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "description",
            "description": "<p>Description of the channel</p>"
          },
          {
            "group": "Parameter",
            "type": "Integer[]",
            "optional": false,
            "field": "permissions",
            "description": "<p>List of IDs of users that can read this channel</p>"
          },
          {
            "group": "Parameter",
            "type": "Integer[]",
            "optional": false,
            "field": "permissionGroups",
            "description": "<p>List of IDs of group that can be allowed to read certain messages of this channel</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "secret",
            "description": "<p>Secret password used to secure the channel </br><b>(Not indicating a secret will make the channel restricted)</b></p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "schema",
            "description": "<p>URL of the schema that the messages of the channel must follow</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "200": [
          {
            "group": "200",
            "type": "String",
            "optional": false,
            "field": "root",
            "description": "<p>Root of the first message in the channel</p>"
          },
          {
            "group": "200",
            "type": "String",
            "optional": true,
            "field": "secret",
            "description": "<p>Secret of the channel (Not given if channel is restricted)</p>"
          },
          {
            "group": "200",
            "type": "Integer",
            "optional": false,
            "field": "owner",
            "description": "<p>ID of the owner of the channel</p>"
          },
          {
            "group": "200",
            "type": "String",
            "optional": false,
            "field": "seed",
            "description": "<p>Seed used to generate the channel. </br><b>The seed is needed to attach messages to the channel. Cannot be recovered</b>.</p>"
          },
          {
            "group": "200",
            "type": "String",
            "optional": false,
            "field": "channelId",
            "description": "<p>ID of the channel inside the gateway</p>"
          },
          {
            "group": "200",
            "type": "String",
            "optional": false,
            "field": "nextRoot",
            "description": "<p>Root of the following message in the channel</p>"
          },
          {
            "group": "200",
            "type": "Boolean",
            "optional": false,
            "field": "restricted",
            "description": "<p>Indicates if the channel is restricted or not.</p>"
          },
          {
            "group": "200",
            "type": "Object[]",
            "optional": false,
            "field": "permissionedUsers",
            "description": "<p>List of users with permission to read this channel</p>"
          },
          {
            "group": "200",
            "type": "Integer",
            "optional": false,
            "field": "permissionedUsers.id",
            "description": "<p>ID of the user</p>"
          },
          {
            "group": "200",
            "type": "String",
            "optional": false,
            "field": "permissionedUsers.name",
            "description": "<p>Name of the user</p>"
          },
          {
            "group": "200",
            "type": "String",
            "optional": false,
            "field": "permissionedUsers.email",
            "description": "<p>Email of the user</p>"
          }
        ]
      }
    },
    "filename": "routes/channels.js",
    "groupTitle": "Channels"
  },
  {
    "type": "get",
    "url": "/channels/:id",
    "title": "Get channel",
    "name": "GetChannel",
    "group": "Channels",
    "version": "0.1.0",
    "success": {
      "fields": {
        "200": [
          {
            "group": "200",
            "type": "Integer",
            "optional": false,
            "field": "id",
            "description": "<p>ID of channel</p>"
          },
          {
            "group": "200",
            "type": "String",
            "optional": false,
            "field": "root",
            "description": "<p>Root of channel</p>"
          },
          {
            "group": "200",
            "type": "Boolean",
            "optional": false,
            "field": "restricted",
            "description": "<p>Indicates if the channel is restricted or not</p>"
          },
          {
            "group": "200",
            "type": "Integer",
            "optional": true,
            "field": "schemaId",
            "description": "<p>ID of the schema that the channel follows.</p>"
          },
          {
            "group": "200",
            "type": "String",
            "optional": true,
            "field": "secret",
            "description": "<p>Secret password to protect the channel (Not given if the channel is restricted)</p>"
          },
          {
            "group": "200",
            "type": "String",
            "optional": false,
            "field": "createdAt",
            "description": "<p>Date when the channel was created</p>"
          },
          {
            "group": "200",
            "type": "Object[]",
            "optional": false,
            "field": "permissionedUsers",
            "description": "<p>List of users with permission to read this channel</p>"
          },
          {
            "group": "200",
            "type": "Integer",
            "optional": false,
            "field": "permissionedUsers.id",
            "description": "<p>ID of the user</p>"
          },
          {
            "group": "200",
            "type": "String",
            "optional": false,
            "field": "permissionedUsers.name",
            "description": "<p>Name of the user</p>"
          },
          {
            "group": "200",
            "type": "String",
            "optional": false,
            "field": "permissionedUsers.email",
            "description": "<p>Email of the user</p>"
          },
          {
            "group": "200",
            "type": "Object[]",
            "optional": false,
            "field": "permissionedGroups",
            "description": "<p>List of user groups with permission to read a referenced message of this channel</p>"
          },
          {
            "group": "200",
            "type": "Integer",
            "optional": false,
            "field": "permissionedGroups.id",
            "description": "<p>ID of the group</p>"
          },
          {
            "group": "200",
            "type": "String",
            "optional": false,
            "field": "permissionedGroups.name",
            "description": "<p>Name of the group</p>"
          },
          {
            "group": "200",
            "type": "Object[]",
            "optional": false,
            "field": "messages",
            "description": "<p>List of messages of this channel</p>"
          },
          {
            "group": "200",
            "type": "String",
            "optional": false,
            "field": "messages.root",
            "description": "<p>Root of the message</p>"
          },
          {
            "group": "200",
            "type": "String",
            "optional": false,
            "field": "messages.timestamp",
            "description": "<p>Timestamp of creation of the channel</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "InvalidChannelID",
            "description": "<p>The channel with specified ID does not exist</p>"
          }
        ]
      }
    },
    "filename": "routes/channels.js",
    "groupTitle": "Channels"
  },
  {
    "type": "post",
    "url": "/groups",
    "title": "Add a new group to the system",
    "name": "Create_groups",
    "group": "Groups",
    "version": "0.1.0",
    "description": "<p>This function requires admin role</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>Name of the group</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "200": [
          {
            "group": "200",
            "type": "Integer",
            "optional": false,
            "field": "id",
            "description": "<p>Group ID</p>"
          },
          {
            "group": "200",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>Group name</p>"
          }
        ]
      }
    },
    "filename": "routes/groups.js",
    "groupTitle": "Groups"
  },
  {
    "type": "get",
    "url": "/groups",
    "title": "Get list of available groups",
    "name": "Get_groups",
    "group": "Groups",
    "version": "0.1.0",
    "success": {
      "fields": {
        "200": [
          {
            "group": "200",
            "type": "Object[]",
            "optional": false,
            "field": "groups",
            "description": "<p>Group list</p>"
          },
          {
            "group": "200",
            "type": "Integer",
            "optional": false,
            "field": "id",
            "description": "<p>Group ID</p>"
          },
          {
            "group": "200",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>Group name</p>"
          }
        ]
      }
    },
    "filename": "routes/groups.js",
    "groupTitle": "Groups"
  },
  {
    "type": "get",
    "url": "/channels/:id/messages/:root",
    "title": "Get message from a channel",
    "name": "Get_message_from_channel",
    "group": "Messages",
    "version": "0.1.0",
    "parameter": {
      "fields": {
        "Path params": [
          {
            "group": "Path params",
            "type": "Integer",
            "optional": false,
            "field": "id",
            "description": "<p>ID of the channel to be consulted</p>"
          },
          {
            "group": "Path params",
            "type": "String",
            "optional": false,
            "field": "root",
            "description": "<p>Root of the message to be consulted</p>"
          }
        ],
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "secret",
            "description": "<p>Password used to secure the channel</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "data",
            "description": "<p>Message inserted in the channel</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "400": [
          {
            "group": "400",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Error message</p>"
          }
        ]
      }
    },
    "filename": "routes/channels.js",
    "groupTitle": "Messages"
  },
  {
    "type": "post",
    "url": "/channels/:id/messages",
    "title": "Post message in channel",
    "name": "Post_message_in_channel",
    "group": "Messages",
    "version": "0.1.0",
    "parameter": {
      "fields": {
        "Path params": [
          {
            "group": "Path params",
            "type": "Number",
            "optional": false,
            "field": "id",
            "description": "<p>ID of the channel where the message will be inserted</p>"
          }
        ],
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "seed",
            "description": "<p>Seed of the channel</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "message",
            "description": "<p>Message to be inserted in the tangle in JSON format</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "secret",
            "description": "<p>Password used to secure the channel</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": true,
            "field": "referece",
            "description": "<p>Message of other channel that this message is referencing</p>"
          },
          {
            "group": "Parameter",
            "type": "Integer",
            "optional": false,
            "field": "referece.channel",
            "description": "<p>ID of other channel that this message is referencing</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "referece.root",
            "description": "<p>Root of the message being referenced</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "root",
            "description": "<p>Message root</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "Forbidden",
            "description": "<p>You have to be the owner of the channel to post a message</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "BadSeedError",
            "description": "<p>Provided seed is not channel's seed</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "BadSecretError",
            "description": "<p>Provided secret is not channel's secret</p>"
          }
        ]
      }
    },
    "filename": "routes/channels.js",
    "groupTitle": "Messages"
  },
  {
    "type": "post",
    "url": "/schemas",
    "title": "Add a new schema to the system",
    "name": "Create_schemas",
    "group": "Schemas",
    "version": "0.1.0",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>Name of the schema</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "schema",
            "description": "<p>JSON schema</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "200": [
          {
            "group": "200",
            "type": "Integer",
            "optional": false,
            "field": "id",
            "description": "<p>Schema ID</p>"
          },
          {
            "group": "200",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>Schema name</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "400": [
          {
            "group": "400",
            "optional": false,
            "field": "ExisitinSchemaError",
            "description": "<p>Schema with this name already exists</p>"
          }
        ]
      }
    },
    "filename": "routes/schemas.js",
    "groupTitle": "Schemas"
  },
  {
    "type": "get",
    "url": "/schemas/:name",
    "title": "Get schema",
    "name": "Get_schema",
    "group": "Schemas",
    "version": "0.1.0",
    "success": {
      "fields": {
        "200": [
          {
            "group": "200",
            "type": "Integer",
            "optional": false,
            "field": "schemas.id",
            "description": "<p>Schema ID</p>"
          },
          {
            "group": "200",
            "type": "String",
            "optional": false,
            "field": "schemas.name",
            "description": "<p>Schema name</p>"
          }
        ]
      }
    },
    "filename": "routes/schemas.js",
    "groupTitle": "Schemas"
  },
  {
    "type": "get",
    "url": "/schemas",
    "title": "Get list of available schemas",
    "name": "Get_schemas",
    "group": "Schemas",
    "version": "0.1.0",
    "success": {
      "fields": {
        "200": [
          {
            "group": "200",
            "type": "Object[]",
            "optional": false,
            "field": "schemas",
            "description": "<p>List of schemas</p>"
          },
          {
            "group": "200",
            "type": "Integer",
            "optional": false,
            "field": "schemas.id",
            "description": "<p>Schema ID</p>"
          },
          {
            "group": "200",
            "type": "String",
            "optional": false,
            "field": "schemas.name",
            "description": "<p>Schema name</p>"
          }
        ]
      }
    },
    "filename": "routes/schemas.js",
    "groupTitle": "Schemas"
  },
  {
    "type": "get",
    "url": "/users/me",
    "title": "Get current user information",
    "name": "CurrentUser",
    "group": "Users",
    "version": "0.1.0",
    "success": {
      "fields": {
        "200": [
          {
            "group": "200",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>Email of the current user</p>"
          },
          {
            "group": "200",
            "type": "Integer",
            "optional": false,
            "field": "id",
            "description": "<p>ID of current user</p>"
          },
          {
            "group": "200",
            "type": "Object[]",
            "optional": false,
            "field": "groups",
            "description": "<p>Groups that the user belongs to</p>"
          }
        ]
      }
    },
    "filename": "routes/users.js",
    "groupTitle": "Users"
  },
  {
    "type": "get",
    "url": "/users/me/channels",
    "title": "Get list of own channels",
    "name": "GetMyChannels",
    "group": "Users",
    "version": "0.1.0",
    "success": {
      "fields": {
        "200": [
          {
            "group": "200",
            "type": "Object[]",
            "optional": false,
            "field": "channels",
            "description": "<p>List of channels</p>"
          },
          {
            "group": "200",
            "type": "Integer",
            "optional": false,
            "field": "channels.id",
            "description": "<p>ID of channel</p>"
          },
          {
            "group": "200",
            "type": "String",
            "optional": false,
            "field": "channels.root",
            "description": "<p>Root of channel</p>"
          },
          {
            "group": "200",
            "type": "Boolean",
            "optional": false,
            "field": "channels.restricted",
            "description": "<p>Indicates if the channel is restricted or not</p>"
          },
          {
            "group": "200",
            "type": "Integer",
            "optional": true,
            "field": "channels.schemaId",
            "description": "<p>ID of the schema that the channel follows.</p>"
          },
          {
            "group": "200",
            "type": "String",
            "optional": true,
            "field": "channels.secret",
            "description": "<p>Secret password to protect the channel (Not given if the channel is restricted)</p>"
          },
          {
            "group": "200",
            "type": "String",
            "optional": false,
            "field": "channels.cretedAt",
            "description": "<p>Date when the channel was created</p>"
          },
          {
            "group": "200",
            "type": "Object[]",
            "optional": false,
            "field": "channels.permissionedUsers",
            "description": "<p>List of users with permission to read this channel</p>"
          },
          {
            "group": "200",
            "type": "Integer",
            "optional": false,
            "field": "channels.permissionedUsers.id",
            "description": "<p>ID of the user</p>"
          },
          {
            "group": "200",
            "type": "String",
            "optional": false,
            "field": "channels.permissionedUsers.name",
            "description": "<p>Name of the user</p>"
          },
          {
            "group": "200",
            "type": "String",
            "optional": false,
            "field": "channels.permissionedUsers.email",
            "description": "<p>Email of the user</p>"
          },
          {
            "group": "200",
            "type": "Object[]",
            "optional": false,
            "field": "channels.permissionedGroups",
            "description": "<p>List of user groups with permission to read a referenced message of this channel</p>"
          },
          {
            "group": "200",
            "type": "Integer",
            "optional": false,
            "field": "channels.permissionedGroups.id",
            "description": "<p>ID of the group</p>"
          },
          {
            "group": "200",
            "type": "String",
            "optional": false,
            "field": "channels.permissionedGroups.name",
            "description": "<p>Name of the group</p>"
          }
        ]
      }
    },
    "filename": "routes/users.js",
    "groupTitle": "Users"
  },
  {
    "type": "get",
    "url": "/users",
    "title": "Get list of users",
    "name": "GetUsers",
    "group": "Users",
    "version": "0.1.0",
    "success": {
      "fields": {
        "200": [
          {
            "group": "200",
            "type": "Object[]",
            "optional": false,
            "field": "users",
            "description": "<p>List of users</p>"
          },
          {
            "group": "200",
            "type": "String",
            "optional": false,
            "field": "users.id",
            "description": "<p>User's id</p>"
          },
          {
            "group": "200",
            "type": "String",
            "optional": false,
            "field": "users.name",
            "description": "<p>User's name</p>"
          },
          {
            "group": "200",
            "type": "String",
            "optional": false,
            "field": "users.email",
            "description": "<p>User's email</p>"
          }
        ]
      }
    },
    "filename": "routes/users.js",
    "groupTitle": "Users"
  },
  {
    "type": "get",
    "url": "/users/:id/groups",
    "title": "Get groups that a user belongs to",
    "name": "Get_user_groups",
    "group": "Users",
    "version": "0.1.0",
    "parameter": {
      "fields": {
        "Path param": [
          {
            "group": "Path param",
            "type": "Integer",
            "optional": false,
            "field": "id",
            "description": "<p>Id of the user</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "200": [
          {
            "group": "200",
            "type": "String[]",
            "optional": false,
            "field": "Groups",
            "description": "<p>Array of groups that the user belongs to</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "404": [
          {
            "group": "404",
            "optional": false,
            "field": "Forbidden",
            "description": "<p>Admin role is needed</p>"
          }
        ]
      }
    },
    "filename": "routes/users.js",
    "groupTitle": "Users"
  },
  {
    "type": "post",
    "url": "/users/login",
    "title": "Login",
    "name": "Login",
    "group": "Users",
    "version": "0.1.0",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>Email of user</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "password",
            "description": "<p>Password of user</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "200": [
          {
            "group": "200",
            "type": "String",
            "optional": false,
            "field": "token",
            "description": "<p>Authorization token</p>"
          },
          {
            "group": "200",
            "type": "Integer",
            "optional": false,
            "field": "id",
            "description": "<p>User id</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "400": [
          {
            "group": "400",
            "optional": false,
            "field": "EmailRequiredError",
            "description": "<p>Email is required</p>"
          },
          {
            "group": "400",
            "optional": false,
            "field": "PasswordRequiredError",
            "description": "<p>Password is required</p>"
          },
          {
            "group": "400",
            "optional": false,
            "field": "InvalidInputError",
            "description": "<p>Email or password are incorrect</p>"
          }
        ]
      }
    },
    "filename": "routes/users.js",
    "groupTitle": "Users"
  },
  {
    "type": "post",
    "url": "/users/register",
    "title": "Register",
    "name": "Register",
    "group": "Users",
    "version": "0.1.0",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>Email of user</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "password",
            "description": "<p>Password of user</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>Name of user</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "200": [
          {
            "group": "200",
            "type": "Integer",
            "optional": false,
            "field": "id",
            "description": "<p>User id</p>"
          },
          {
            "group": "200",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>User email</p>"
          },
          {
            "group": "200",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>User name</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "400": [
          {
            "group": "400",
            "optional": false,
            "field": "EmailRequiredError",
            "description": "<p>Email is required</p>"
          },
          {
            "group": "400",
            "optional": false,
            "field": "PasswordRequiredError",
            "description": "<p>Password is required</p>"
          },
          {
            "group": "400",
            "optional": false,
            "field": "NameRequiredError",
            "description": "<p>Name is required</p>"
          }
        ]
      }
    },
    "filename": "routes/users.js",
    "groupTitle": "Users"
  },
  {
    "type": "put",
    "url": "/users/:id/groups",
    "title": "Set groups that a user belongs to",
    "name": "Set_user_groups",
    "group": "Users",
    "version": "0.1.0",
    "description": "<p>This function requires admin role</p>",
    "parameter": {
      "fields": {
        "Path param": [
          {
            "group": "Path param",
            "type": "Integer",
            "optional": false,
            "field": "id",
            "description": "<p>Id of the user</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "200": [
          {
            "group": "200",
            "type": "Object[]",
            "optional": false,
            "field": "groups",
            "description": "<p>List of groups that the user belongs to</p>"
          },
          {
            "group": "200",
            "type": "Integer",
            "optional": false,
            "field": "id",
            "description": "<p>ID of the group</p>"
          },
          {
            "group": "200",
            "type": "String",
            "optional": false,
            "field": "Name",
            "description": "<p>of the group</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "400": [
          {
            "group": "400",
            "optional": false,
            "field": "GroupsRequired",
            "description": "<p>List of groups to be assigned is required.</p>"
          }
        ],
        "403": [
          {
            "group": "403",
            "optional": false,
            "field": "Forbidden",
            "description": "<p>Admin role is needed</p>"
          }
        ]
      }
    },
    "filename": "routes/users.js",
    "groupTitle": "Users"
  }
] });

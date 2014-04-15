node-mongo-secure
=================

Node.js server using MongoDB with user authentication


### Update a mongodb.conf 
*(can be a temporary file for testing)*

      auth = true


### Launch Mongo with this config file

      mongod --config mongodb.conf


### Create a User Admin

      use admin
      db.createUser(
        {
          user: "siteUserAdmin",
          pwd: "password",
          roles:
          [
            {
              role: "userAdminAnyDatabase",
              db: "admin"
            }
          ]
        }
      )


### Login with User Admin

      mongo -u siteUserAdmin -p password --authenticationDatabase admin


### Create a role

      use admin
      db.createRole({
          role: "myRole",
          privileges: [
              {
                  resource: {
                      db: "reports",
                      collection: ""
                  },
                  actions: [
                      "find",
                      "update",
                      "insert"
                  ]
              }
          ],
          roles: [
              {
                  role: "read",
                  db: "reports"
              }
          ],
          writeConcern: {
              w: "majority",
              wtimeout: 5000
          }
      })


### Create new user with this role

      use admin
      db.createUser(
          {
            user: "reportsUser",
            pwd: "12345678",
            roles: [ "myRole" ]
          }
      )


### Login with reportsUser

      mongo -u reportsUser -p 12345678 --authenticationDatabase admin


### Test reportsUser access

      use reports
      db.report.insert({foo: 1, bar: "2"})
      db.report.find()



### Using reportsUser in a Node.js project

      var MongoClient = require('mongodb').MongoClient;

      exports.index = function(req, res){

         var db = MongoClient.connect('mongodb://reportsUser:password@localhost:27017/admin', function(err, db) {
            if(err) throw err;

            var reports = db.db('reports');
            var collection = reports.collection('report');
            console.log('collection: ',collection);
            collection.find({}).toArray(function(err, report){
               if(err) throw err;

               res.send(report);
            });
         });
      };



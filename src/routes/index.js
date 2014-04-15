
/*
 * GET home page.
 */
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
         //res.send('OK');
      //res.render('index', { title: 'Express' });
   });
};

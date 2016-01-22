var Storage = require('./storage')
  , db = new Storage({dburl: 'postgres://ewandennis@localhost/raffles'});


db.storeEmail('HEAD', '{"body":"hiyaa"}').then(function() {
  console.log("WOOO");
}).catch(function(err) {
  console.log("AAW: " + err);
});

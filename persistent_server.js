var http = require('http');
var mysql = require('mysql');
// Add /lib/cors.js from nodechat
var defaultCorsHeaders = require("./lib/cors.js").defaultCorsHeaders;

/* If the node mysql module is not found on your system, you may
 * need to do an "npm install -g mysql". */

var dbConnection = mysql.createConnection({
  user: "tmschl",
  password: "",
  database: "chat",
  multipleStatements: true
});
/* You'll need to fill this out with your mysql username and password.
 * database: "chat" specifies that we're using the database called 
 * "chat", which we created by running schema.sql.*/

dbConnection.connect();
/* Now you can make queries to the Mysql database using the
 * dbConnection.query() method.
 * See https://github.com/felixge/node-mysql for more details about
 * using this module.*/

var messagesObject = {
  list: [],

  getMessages: function(res){
    var query = connection.query("SELECT * FROM messages");
    var that = this;
    this.list = [];

    query
      .on('result', function(row){
        that.list.push(row);
      })
      .on('end', function() {
        res.end(JSON.stringify(that.list));
      });
  },

  writeToDb: function(newMessage){
    var resultId = null;
    var query1 = connection.query('insert ignore into users set user_name='+mysql.escape(newMessage.user_name)+';');
    var query2 = connection.query(
      'insert into messages (user_name, room_name) ' +
      'select users.user_name, rooms.room_name FROM users, rooms WHERE user.user_name =' +
      mysql.escape(newMessage.user_name) +
      'AND rooms.room_name =' + mysql.escape(newMessage.room_name) +
      ';', function(error, result){
        resultId = result.insertId;
      }
    );

    query1
      .on('end', function() {
        query2
          .on('end', function() {
            connection.query(
              "update messages set messages.text="+
              mysql.escape(newMessage.text) +
              "where messages id =" +
              resultId + 
              ';'
            );
          });
      })
      .on('error', function(e) {
        console.log(e);
      });
  }
}

var createResponse = function(code, response) {
  var statusCode = code;
  var headers = defaultCorsHeaders();
  headers['Content-Type'] = "text/plain";
  response.writeHead(statusCode, headers);
  return response;
}

var handlePostRequest = function(req, res) {
  if(req.url === "/1/classes/messages"){
    request.on("data", function(chunk){
      request.content = '';
      request.content += chunk.toString();
    });

    request.on('end', function() {
      var msg = JSON.parse(request.content);
      messagesObject.writeToDb(msg);
      response = createResponse(200, response);
      response.end();
    });
  }
}

var handleGetRequest = function(req, res){
  if (req.url === "/1/classes/messages"){
    res = createResponse(200, response);
    messagesObject.getMessages(response);
  }
}

var requestListener = function(req, res) {
  console.log("Serving request type " + req.method + " for url " + req.url );

  var statusCode = 200;
  var headers = defaultCorsHeaders();
  headers['Content-Type'] = "text/plain";
  res.writeHead(statusCode, headers);

  switch(req.method) {
    case "OPTIONS":
      res.end();
    case "GET":
      handleGetRequest(req, res);
    case "POST":
      handlePostRequest(req, res);
      break;
    default:
      res.writeHead(404, "Not found", {"Content-Type": "text/html"});
      res.end();
  }
};

var server = http.createServer(requestListener);

var port = 9000;
var ip = "127.0.0.1";
console.log("Listening on http://" + ip + ":" + port);
server.listen(port, ip);

/* You already know how to create an http server from the previous
 * assignment; you can re-use most of that code here. */

dbConnection.end();

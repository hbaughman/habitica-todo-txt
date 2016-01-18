var request = require("request");
var options = require("./options");

function Dropbox(todoPath, accessToken) {
  this.todoPath = todoPath;
  this.accessToken = accessToken;
}

Dropbox.prototype.defaultHeaders = {
  Authorization: "Bearer " + this.accessToken,
  "Content-Type": "application/json"
};

Dropbox.prototype.downloadTodo = function(callback) {
  request({
    url: "https://content.dropboxapi.com/2/files/download",
    headers: {
      Authorization: "Bearer " + this.accessToken,
      "Dropbox-API-Arg": JSON.stringify({
        "path": this.todoPath
      })
    }
  }, callback)
};

Dropbox.prototype.revisions = function(callback) {
  request.post({
    url: "https://api.dropboxapi.com/2/files/list_revisions",
    //headers: this.defaultHeaders,
    headers: {
      Authorization: "Bearer " + this.accessToken,
      "Content-Type": "application/json"
    },
    json: {
      "path": this.todoPath,
      // We need all the revisions since the last last check/update. We'll need
      // to repoll if this is insufficient.
      "limit": 10
    }
  }, callback)
}

function logResponse(err, resp, body) {
  if (err) throw err;
  console.log(resp.statusCode, body);
}

module.exports = Dropbox;

var dropbox = new Dropbox("/todo/todo.txt", options.access_token)
dropbox.revisions(logResponse);

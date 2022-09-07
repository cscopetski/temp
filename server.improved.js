const http = require("http"),
  fs = require("fs"),
  // IMPORTANT: you must run `npm install` in the directory for this assignment
  // to install the mime library used in the following line of code
  mime = require("mime"),
  dir = "public/",
  port = 3000;

let idCounter = 0;

const appdata = [];

const server = http.createServer(function (request, response) {
  if (request.method === "GET") {
    handleGet(request, response);
  } else if (request.method === "POST") {
    handlePost(request, response);
  }
});

const handleGet = function (request, response) {
  const filename = dir + request.url.slice(1);

  if (request.url === "/") {
    sendFile(response, "public/index.html");
  } else if (request.url === "/get-food") {
    response.writeHead(200, "OK", { "Content-Type": "text/plain" });
    response.end(JSON.stringify(appdata));
  } else {
    sendFile(response, filename);
  }
};

const handlePost = function (request, response) {
  let dataString = "";

  request.on("data", function (data) {
    dataString += data;
  });
  if (request.url === "/submit") {
    request.on("end", function () {
      const json = JSON.parse(dataString);

      json.priceperpound =
        json.foodweight === 0 ? 0 : json.foodprice / json.foodweight;
      json.id = idCounter;
      idCounter++;

      appdata.push(json);

      response.writeHead(200, "OK", { "Content-Type": "text/plain" });
      response.end(JSON.stringify(appdata));
    });
  } else if (request.url === "/delete") {
    request.on("end", function () {
      const json = JSON.parse(dataString);
      json.forEach((element) => {
        for (let i = 0; i < appdata.length; i++) {
          if (appdata[i].id === parseInt(element)) {
            appdata.splice(i, 1);
          }
        }
      });
      response.writeHead(200, "OK", { "Content-Type": "text/plain" });
      response.end(JSON.stringify(appdata));
    });
  } else {
    request.on("end", function () {
      console.error(request.url);
      response.writeHead(404, "Not Found", { "Content-Type": "text/plain" });
      response.end();
    });
  }
};

const sendFile = function (response, filename) {
  const type = mime.getType(filename);

  fs.readFile(filename, function (err, content) {
    if (err === null) {
      response.writeHeader(200, { "Content-Type": type });
      response.end(content);
    } else {
      response.writeHeader(404);
      response.end("404 Error: File Not Found");
    }
  });
};

server.listen(process.env.PORT || port);

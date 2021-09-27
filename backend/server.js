const http = require("http");
const fs = require("fs").promises;
const path = require("path");

{
  let routeHandlers = null;
  let options = {};

  const responseWithHTML = (res, html) => {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.write(html);
    res.end();
  };

  const responseWithJSON = (res, object) => {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.write(JSON.stringify(object));
    res.end();
  };

  const responseWithError = (res, statusCode, message) => {
    if (options.withLogs) {
      fs.appendFile(
        path.join(__dirname, options.withLogs),
        `Time: ${new Date().toISOString()}, error message: ${message}\n`
      );
    }

    const isHtml = !!message.match(/^<([a-zA-Z0-9]+)>.*<\/\1>$/g);
    const contentType = isHtml ? "text/html" : "text/plain";
    res.writeHead(statusCode, { "Content-Type": contentType });
    res.write(message);
    res.end();
  };

  const requestHandler = (req, res) => {
    // Binds
    res.html = responseWithHTML.bind(null, res);
    res.json = responseWithJSON.bind(null, res);
    res.error = responseWithError.bind(null, res);

    if (req.url[req.url.length - 1] !== "/") req.url += "/";

    // Actual route handling
    if (
      typeof routeHandlers[req.method] == "object" &&
      typeof routeHandlers[req.method][req.url] === "function"
    ) {
      if (req.method === "POST") {
        let chunks = "";

        req.on("data", (data) => {
          chunks += data;
        });

        req.on("end", () => {
          req.body = JSON.parse(chunks.toString());
          routeHandlers[req.method][req.url](req, res);
        });

        return;
      } else {
        return routeHandlers[req.method][req.url](req, res);
      }
    }

    res.error(404, "<h1>404 Not Found</h1>");
  };

  const server = (userRoutes, userOptions) => {
    routeHandlers = userRoutes;
    options = userOptions;

    return http.createServer(requestHandler);
  };

  const wrapRoutes = (routes, prefix = "") => {
    let copy = {};

    Object.keys(routes).forEach((method) => {
      copy[method] = {};
      Object.keys(routes[method]).forEach((route) => {
        const newRoute = route[route.length - 1] !== "/" ? route + "/" : route;
        copy[method][prefix + newRoute] = routes[method][route];
      });
    });

    return copy;
  };

  module.exports = { server, wrapRoutes };
}

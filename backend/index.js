const { server, wrapRoutes } = require("./server");

const PORT = process.env.PORT || 3001;

// Variables (should be in a database)
let data_storage = {
  lamp: "ON",
  wireless_lamp: "OFF",
  ir_lamp: "OFF",
  pump: "OFF",
  music: "ON",
  container: "Full",
  backlight: "ON",
};

const routeHandlers = {
  GET: {
    "/": (_, res) => {
      res.html("<h1>Hello world</h1>");
    },
    "/switch-status": (_, res) => {
      res.json(data_storage);
    },
  },
  POST: {
    "/buttons": (req, res) => {
      if (!req.body) return res.error(400, "<h1>Client side error</h1>");

      data_storage[req.body.button] = req.body.state;
      res.json(data_storage);
    },
  },
};

const apiRoutes = wrapRoutes(routeHandlers, "/api");

server(apiRoutes, { withLogs: "backend.log" }).listen(PORT, () =>
  console.log(`Server is started on port: ${PORT}`)
);

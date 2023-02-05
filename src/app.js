import express from "express";

import pedidosRoutes from "./routes/pedidosRoutes.js";

class App {
  constructor() {
    this.server = express();

    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.server.use(express.json());
  }

  routes() {
    // Este precisa ser sempre o primeiro
    this.server.use((req, res, next) => {
      console.log(
        `Log - ${new Date().toUTCString()} - ${req.method} - ${req.url}`
      );
      next();
    });
    this.server.get("/", (req, res) => {
      res.json({ message: "API ON" });
    });
    this.server.use("/pedidos", pedidosRoutes);
    // Este precisa ser sempre o ultimo
    this.server.use((err, req, res, next) => {
      console.log(`ERROR - ${new Date().toUTCString()} - ${err}`);
      res.status(err.status || 500).json({ error: err.message || err });
    });
  }
}

export default new App().server;

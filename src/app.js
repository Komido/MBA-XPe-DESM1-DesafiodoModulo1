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
  }
}

export default new App().server;

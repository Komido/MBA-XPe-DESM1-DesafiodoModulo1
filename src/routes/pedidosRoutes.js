import { Router } from "express";

import PedidosController from "../app/controllers/PedidosController.js";

const routes = new Router();

routes.get("/", PedidosController.index);
routes.post("/", PedidosController.post);
routes.put("/", PedidosController.put);
routes.patch("/", PedidosController.patch);
routes.delete("/:id", PedidosController.delete);
routes.get("/:id", PedidosController.show);
routes.get("/cliente/:name", PedidosController.pedidosCliente);
routes.get("/produto/:produto", PedidosController.totalVendidoProduto);
routes.get("/pedido/maisvendido", PedidosController.produtosMaisVendidos);

export default routes;

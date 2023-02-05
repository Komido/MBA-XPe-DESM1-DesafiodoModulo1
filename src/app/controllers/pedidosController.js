import { promises as fs } from "fs";

class PedidosController {
  async post(req, res, next) {
    try {
      const pedido = req.body;

      const pedidos = JSON.parse(await fs.readFile(global.fileName));

      const newPedido = {
        id: pedidos.nextId++,
        ...pedido,
        entregue: false,
        timestamp: new Date(),
      };

      pedidos.pedidos.push(newPedido);

      await fs.writeFile(global.fileName, JSON.stringify(pedidos, null, 2));

      return res.json(newPedido);
    } catch (error) {
      next(error);
    }
  }

  async put(req, res, next) {
    try {
      const pedido = req.body;

      const pedidos = JSON.parse(await fs.readFile(global.fileName));

      const index = pedidos.pedidos.findIndex((ped) => ped.id === pedido.id);

      if (index === -1) {
        throw new Error("Pedido não encontrado");
      }

      const newPedido = {
        ...pedido,
        timestamp: new Date(),
      };

      pedidos.pedidos[index] = newPedido;

      await fs.writeFile(global.fileName, JSON.stringify(pedidos, null, 2));
      return res.json(pedidos.pedidos[index]);
    } catch (error) {
      next(error);
    }
  }

  async patch(req, res, next) {
    try {
      const pedido = req.body;

      const pedidos = JSON.parse(await fs.readFile(global.fileName));

      const index = pedidos.pedidos.findIndex((ped) => ped.id === pedido.id);

      if (index === -1) {
        throw new Error("Pedido não encontrado");
      }

      pedidos.pedidos[index].entregue = pedido.entregue;

      await fs.writeFile(global.fileName, JSON.stringify(pedidos, null, 2));
      return res.json(pedidos.pedidos[index]);
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const { id } = req.params;

      const pedidos = JSON.parse(await fs.readFile(global.fileName));

      pedidos.pedidos = pedidos.pedidos.filter(
        (ped) => ped.id !== parseInt(id)
      );

      await fs.writeFile(global.fileName, JSON.stringify(pedidos, null, 2));

      return res.json(pedidos.pedidos);
    } catch (error) {
      next(error);
    }
  }

  async show(req, res, next) {
    try {
      const { id } = req.params;

      const pedidos = JSON.parse(await fs.readFile(global.fileName));

      const pedido = pedidos.pedidos.find((ped) => ped.id === parseInt(id));

      if (!pedido) {
        throw new Error("Pedido não encontrado");
      }

      return res.json(pedido);
    } catch (error) {
      next(error);
    }
  }

  async pedidosCliente(req, res, next) {
    try {
      const { name } = req.params;

      const pedidos = JSON.parse(await fs.readFile(global.fileName));

      const pedidosCliente = pedidos.pedidos.filter(
        (ped) =>
          ped.cliente.toLowerCase() === name.toLowerCase() &&
          ped.entregue === true
      );

      if (pedidosCliente.length === 0) {
        throw new Error("Pedidos não encontrados para o cliente");
      }

      let total = 0;

      pedidosCliente.map((ped) => {
        total = total + ped.valor;
      });

      return res.json({ total });
    } catch (error) {
      next(error);
    }
  }

  async totalVendidoProduto(req, res, next) {
    try {
      const { produto } = req.params;

      const pedidos = JSON.parse(await fs.readFile(global.fileName));

      const pedidosCliente = pedidos.pedidos.filter(
        (ped) =>
          ped.produto.toLowerCase() === produto.toLowerCase() &&
          ped.entregue === true
      );

      if (pedidosCliente.length === 0) {
        throw new Error("Produto ainda não possui venda entregue");
      }

      let total = 0;

      pedidosCliente.map((ped) => {
        total = total + ped.valor;
      });

      return res.json({ total });
    } catch (error) {
      next(error);
    }
  }

  async produtosMaisVendidos(req, res, next) {
    try {
      const pedidos = JSON.parse(await fs.readFile(global.fileName));

      const products = {};
      pedidos.pedidos.forEach((item) => {
        if (products[item.produto] === undefined) {
          if (item.entregue === true) {
            products[item.produto] = 1;
          }
        } else {
          if (item.entregue === true) {
            products[item.produto] += 1;
          }
        }
      });

      const sortedProducts = Object.entries(products).sort(
        (a, b) => b[1] - a[1]
      );

      const result = sortedProducts.map((p) => `${p[0]} - ${p[1]}`);
      return res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async index(req, res) {
    const pedidos = JSON.parse(await fs.readFile(global.fileName));
    return res.json(pedidos.pedidos);
  }
}

export default new PedidosController();

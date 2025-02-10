import { Router } from "express";

import OrderController from "../controllers/OrderController";
import OrderDTO from "../core/orders/dto/OrderDTO";
import MongoOrderDataSource from "../external/MongoOrderDataSource";
import ResourceNotFoundError from "../core/common/exceptions/ResourceNotFoundError";
import ItemDTO from "../core/orders/dto/ItemDTO";
import ClosedOrderError from "../core/orders/exceptions/ClosedOrderError";
import EmptyOrderError from "../core/orders/exceptions/EmptyOrderError";
import { MercadoPagoPaymentSystem } from "../external/MercadoPagoPaymentSystem";
import CustomersService from "../external/CustomersService";
import ProductsService from "../external/ProductsService";

const ordersAPIRouter = Router();

ordersAPIRouter.post("/orders", async (req, res) => {
  try {
    const orderDTO = new OrderDTO({ customerId: req.body.customerId });
    const orderCreated = await OrderController.createOrder(new MongoOrderDataSource(), new CustomersService(), orderDTO);
    return res.status(201).json(orderCreated);
  } catch (error: any) {
    if (error instanceof ResourceNotFoundError) return res.status(400).json({ error: error.message });
    return res.status(500).json({ error: error.message });
  }
});

ordersAPIRouter.get("/orders", async (req, res) => {
  try {
    const orders = await OrderController.getOrders(new MongoOrderDataSource());
    return res.status(200).json(orders);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

ordersAPIRouter.get("/orders/all", async (req, res) => {
  try {
    const order = await OrderController.getOrdersAll(new MongoOrderDataSource());
    return res.status(200).json(order);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

ordersAPIRouter.get("/orders/:orderId", async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const order = await OrderController.getOrder(new MongoOrderDataSource(), orderId);
    return res.status(201).json(order);
  } catch (error: any) {
    if (error instanceof ResourceNotFoundError) {
      return res.status(404).json({ error: error.message });
    }
    return res.status(500).json({ error: error.message });
  }
});

ordersAPIRouter.post("/orders/:orderId/checkout", async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const checkoutResponse = await OrderController.checkout(new MongoOrderDataSource(), new MercadoPagoPaymentSystem(), orderId);
    return res.status(200).json(checkoutResponse);
  } catch (error: any) {
    if (error instanceof EmptyOrderError) return res.status(400).json({ error: error.message });
    if (error instanceof ResourceNotFoundError) {
      return res.status(404).json({ error: error.message });
    }
    return res.status(500).json({ error: error.message });
  }
});

ordersAPIRouter.get("/orders/:orderId/payment_status", async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const status = await OrderController.getPaymentStatus(new MongoOrderDataSource(), orderId);
    return res.status(200).json(status);
  } catch (error: any) {
    if (error instanceof ResourceNotFoundError) {
      return res.status(404).json({ error: error.message });
    }
    return res.status(500).json({ error: error.message });
  }
});

ordersAPIRouter.post("/orders/:orderId/status", async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const { status } = req.body;
    const order = await OrderController.updateOrderStatus(new MongoOrderDataSource(), orderId, status);
    return res.status(200).json(order);
  } catch (error: any) {
    if (error instanceof EmptyOrderError) return res.status(400).json({ error: error.message });
    return res.status(500).json({ error: error.message });
  }
});

ordersAPIRouter.post("/orders/:orderId/items", async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const { productId, quantity } = req.body;
    const addItemDTO = new ItemDTO({ productId, quantity });
    const order = await OrderController.addItem(new MongoOrderDataSource(), new ProductsService(), orderId, addItemDTO);
    return res.status(201).json(order);
  } catch (error: any) {
    if (error instanceof ResourceNotFoundError) return res.status(404).json({ error: error.message });
    if (error instanceof ClosedOrderError) return res.status(400).json({ error: error.message });
    return res.status(500).json({ error: error.message });
  }
});

ordersAPIRouter.put("/orders/:orderId/items/:itemId", async (req, res) => {
  try {
    const { orderId, itemId } = req.params;
    const { quantity } = req.body;
    const updateItemDTO = new ItemDTO({ quantity });
    const orderUpdated = await OrderController.updateItem(new MongoOrderDataSource(), orderId, itemId, updateItemDTO);
    return res.status(200).json(orderUpdated);
  } catch (error: any) {
    if (error instanceof ResourceNotFoundError) return res.status(404).json({ error: error.message });
    if (error instanceof ClosedOrderError) return res.status(400).json({ error: error.message });
    return res.status(500).json({ error: error.message });
  }
});

ordersAPIRouter.delete("/orders/:orderId/items/:itemId", async (req, res) => {
  try {
    const { orderId, itemId } = req.params;
    await OrderController.deleteItem(new MongoOrderDataSource(), orderId, itemId);
    return res.status(204).json({});
  } catch (error: any) {
    if (error instanceof ResourceNotFoundError) return res.status(404).json({ error: error.message });
    if (error instanceof ClosedOrderError) return res.status(400).json({ error: error.message });
    return res.status(500).json({ error: error.message });
  }
});

export default ordersAPIRouter;
import { Request, Response } from 'express';
import { OrderService } from '../services/OrderService';
import { OrderStatus } from '../models/Order';

export class OrderController {
  private orderService: OrderService;

  constructor() {
    this.orderService = new OrderService();
  }

  private checkAuth(req: Request): string {
    if (!req.user?.id) {
      throw new Error('User not authenticated');
    }
    return req.user.id;
  }

  createOrder = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = this.checkAuth(req);
      const order = await this.orderService.createOrder(userId);
      res.status(201).json(order);
    } catch (error) {
      res.status(500).json({ message: 'Error creating order', error });
    }
  };

  getOrders = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = this.checkAuth(req);
      const orders = await this.orderService.getOrdersByUserId(userId);
      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching orders', error });
    }
  };

  getOrderById = async (req: Request, res: Response): Promise<void> => {
    try {
      const order = await this.orderService.getOrderById(req.params.id);
      if (!order) {
        res.status(404).json({ message: 'Order not found' });
        return;
      }
      res.json(order);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching order', error });
    }
  };

  updateOrderStatus = async (req: Request, res: Response): Promise<void> => {
    try {
      const { status } = req.body;
      if (!Object.values(OrderStatus).includes(status)) {
        res.status(400).json({ message: 'Invalid order status' });
        return;
      }

      const order = await this.orderService.updateOrderStatus(req.params.id, status);
      if (!order) {
        res.status(404).json({ message: 'Order not found' });
        return;
      }
      res.json(order);
    } catch (error) {
      res.status(500).json({ message: 'Error updating order status', error });
    }
  };
} 
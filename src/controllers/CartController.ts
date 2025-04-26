import { Request, Response } from 'express';
import { CartService } from '../services/CartService';

export class CartController {
  private cartService: CartService;

  constructor() {
    this.cartService = new CartService();
  }

  private checkAuth(req: Request): string {
    if (!req.user?.id) {
      throw new Error('User not authenticated');
    }
    return req.user.id;
  }

  getCart = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = this.checkAuth(req);
      const cart = await this.cartService.getCartByUserId(userId);
      if (!cart) {
        res.status(404).json({ message: 'Cart not found' });
        return;
      }
      res.json(cart);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching cart', error });
    }
  };

  addItemToCart = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = this.checkAuth(req);
      const cart = await this.cartService.addItemToCart(userId, req.body);
      res.status(201).json(cart);
    } catch (error) {
      res.status(500).json({ message: 'Error adding item to cart', error });
    }
  };

  updateCartItem = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = this.checkAuth(req);
      const cart = await this.cartService.updateCartItem(
        userId,
        req.params.itemId,
        req.body.quantity
      );
      if (!cart) {
        res.status(404).json({ message: 'Cart or item not found' });
        return;
      }
      res.json(cart);
    } catch (error) {
      res.status(500).json({ message: 'Error updating cart item', error });
    }
  };

  removeItemFromCart = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = this.checkAuth(req);
      const cart = await this.cartService.removeItemFromCart(
        userId,
        req.params.itemId
      );
      if (!cart) {
        res.status(404).json({ message: 'Cart or item not found' });
        return;
      }
      res.json(cart);
    } catch (error) {
      res.status(500).json({ message: 'Error removing item from cart', error });
    }
  };

  toggleItemSelection = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = this.checkAuth(req);
      const cart = await this.cartService.toggleItemSelection(
        userId,
        req.params.itemId
      );
      if (!cart) {
        res.status(404).json({ message: 'Cart or item not found' });
        return;
      }
      res.json(cart);
    } catch (error) {
      res.status(500).json({ message: 'Error toggling item selection', error });
    }
  };

  clearCart = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = this.checkAuth(req);
      const cart = await this.cartService.clearCart(userId);
      if (!cart) {
        res.status(404).json({ message: 'Cart not found' });
        return;
      }
      res.json(cart);
    } catch (error) {
      res.status(500).json({ message: 'Error clearing cart', error });
    }
  };
} 
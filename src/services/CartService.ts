import Cart, { ICart, ICartItem } from '../models/Cart';
import Product from '../models/Product';
import mongoose from 'mongoose';

export class CartService {
  async getCartByUserId(userId: string): Promise<ICart | null> {
    return Cart.findOne({ userId }).populate('items.productId');
  }

  async addItemToCart(userId: string, item: { productId: string; quantity: number }): Promise<ICart> {
    const cart = await Cart.findOne({ userId });
    const product = await Product.findById(item.productId);

    if (!product) {
      throw new Error('Product not found');
    }

    if (product.stock < item.quantity) {
      throw new Error('Insufficient stock');
    }

    const cartItem: ICartItem = {
      productId: product._id,
      quantity: item.quantity,
      price: product.price,
      selected: true
    };

    if (!cart) {
      const newCart = new Cart({
        userId,
        items: [cartItem],
        totalAmount: product.price * item.quantity
      });
      return newCart.save();
    }

    const existingItemIndex = cart.items.findIndex(
      (i) => i.productId.toString() === product._id.toString()
    );

    if (existingItemIndex > -1) {
      cart.items[existingItemIndex].quantity += item.quantity;
    } else {
      cart.items.push(cartItem);
    }

    cart.totalAmount = cart.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    return cart.save();
  }

  async updateCartItem(
    userId: string,
    itemId: string,
    quantity: number
  ): Promise<ICart | null> {
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      throw new Error('Cart not found');
    }

    const itemIndex = cart.items.findIndex(
      (item) => item._id?.toString() === itemId
    );

    if (itemIndex === -1) {
      throw new Error('Item not found in cart');
    }

    const product = await Product.findById(cart.items[itemIndex].productId);
    if (!product || product.stock < quantity) {
      throw new Error('Insufficient stock');
    }

    cart.items[itemIndex].quantity = quantity;
    cart.totalAmount = cart.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    return cart.save();
  }

  async removeItemFromCart(
    userId: string,
    itemId: string
  ): Promise<ICart | null> {
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      throw new Error('Cart not found');
    }

    cart.items = cart.items.filter(
      (item) => item._id?.toString() !== itemId
    );

    cart.totalAmount = cart.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    return cart.save();
  }

  async toggleItemSelection(
    userId: string,
    itemId: string
  ): Promise<ICart | null> {
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      throw new Error('Cart not found');
    }

    const itemIndex = cart.items.findIndex(
      (item) => item._id?.toString() === itemId
    );

    if (itemIndex === -1) {
      throw new Error('Item not found in cart');
    }

    cart.items[itemIndex].selected = !cart.items[itemIndex].selected;
    return cart.save();
  }

  async clearCart(userId: string): Promise<ICart | null> {
    return Cart.findOneAndUpdate(
      { userId },
      { items: [], totalAmount: 0 },
      { new: true }
    );
  }
} 
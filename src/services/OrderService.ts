import Order, { IOrder, OrderStatus } from '../models/Order';
import Cart from '../models/Cart';
import Product from '../models/Product';
import { ProductService } from './ProductService';
import mongoose from 'mongoose';

export class OrderService {
  private productService: ProductService;

  constructor() {
    this.productService = new ProductService();
  }

  async createOrder(userId: string): Promise<IOrder> {
    console.log('\n=== Starting Order Creation ===');
    console.log('User ID:', userId);
    
    const cart = await Cart.findOne({ userId }).populate('items.productId');
    console.log('\n=== Cart Details ===');
    console.log('Cart ID:', cart?._id);
    console.log('Number of items:', cart?.items.length);
    
    if (!cart) {
      throw new Error('Cart not found');
    }

    const selectedItems = cart.items.filter(item => item.selected);
    console.log('\n=== Selected Items ===');
    console.log('Number of selected items:', selectedItems.length);
    
    if (selectedItems.length === 0) {
      throw new Error('No items selected for checkout');
    }

    // Verify stock and calculate total
    let totalAmount = 0;
    const orderItems = [];

    for (const item of selectedItems) {
      console.log('\n=== Processing Item ===');
      console.log('Item ID:', item._id);
      console.log('Product ID:', item.productId);
      console.log('Quantity:', item.quantity);
      console.log('Price:', item.price);
      
      let productId: mongoose.Types.ObjectId;
      if (item.productId instanceof mongoose.Types.ObjectId) {
        productId = item.productId;
        console.log('ProductId is ObjectId:', productId);
      } else if (typeof item.productId === 'string') {
        productId = new mongoose.Types.ObjectId(item.productId);
        console.log('ProductId converted from string:', productId);
      } else if (typeof item.productId === 'object' && item.productId !== null) {
        // Handle case where productId is a populated product object
        productId = new mongoose.Types.ObjectId(item.productId._id);
        console.log('ProductId extracted from object:', productId);
      } else {
        console.error('Invalid productId type:', typeof item.productId);
        throw new Error('Invalid product ID format');
      }

      const product = await Product.findById(productId);
      console.log('\n=== Product Details ===');
      console.log('Product ID:', product?._id);
      console.log('Product Name:', product?.name);
      console.log('Product Stock:', product?.stock);
      
      if (!product) {
        throw new Error(`Product ${productId} not found`);
      }
      if (product.stock < item.quantity) {
        throw new Error(`Insufficient stock for product ${product.name}`);
      }
      totalAmount += item.price * item.quantity;

      orderItems.push({
        productId: productId,
        quantity: item.quantity,
        price: item.price,
        sourceUrl: product.sourceUrl
      });
    }

    console.log('\n=== Order Summary ===');
    console.log('Total Amount:', totalAmount);
    console.log('Number of Items:', orderItems.length);

    // Create order
    const order = new Order({
      userId,
      items: orderItems,
      totalAmount,
      status: OrderStatus.PENDING,
      paymentId: `PAY-${Date.now()}` // Simulated payment ID
    });

    console.log('\n=== Created Order ===');
    console.log('Order ID:', order._id);
    console.log('Payment ID:', order.paymentId);
    console.log('Status:', order.status);

    // Update stock
    for (const item of selectedItems) {
      let productId: mongoose.Types.ObjectId;
      if (item.productId instanceof mongoose.Types.ObjectId) {
        productId = item.productId;
      } else if (typeof item.productId === 'string') {
        productId = new mongoose.Types.ObjectId(item.productId);
      } else if (typeof item.productId === 'object' && item.productId !== null) {
        productId = new mongoose.Types.ObjectId(item.productId._id);
      } else {
        throw new Error('Invalid product ID format');
      }
      console.log('\n=== Updating Stock ===');
      console.log('Product ID:', productId);
      console.log('Quantity to deduct:', item.quantity);
      await this.productService.updateStock(productId.toString(), item.quantity);
    }

    // Clear selected items from cart
    cart.items = cart.items.filter(item => !item.selected);
    cart.totalAmount = cart.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
    console.log('\n=== Updated Cart ===');
    console.log('Remaining items:', cart.items.length);
    console.log('New total amount:', cart.totalAmount);
    await cart.save();

    try {
      const savedOrder = await order.save();
      console.log('\n=== Order Saved Successfully ===');
      console.log('Order ID:', savedOrder._id);
      console.log('Status:', savedOrder.status);
      return savedOrder;
    } catch (error) {
      console.error('\n=== Error Saving Order ===');
      console.error('Error details:', error);
      throw error;
    }
  }

  async getOrdersByUserId(userId: string): Promise<IOrder[]> {
    return Order.find({ userId }).populate('items.productId');
  }

  async getOrderById(orderId: string): Promise<IOrder | null> {
    return Order.findById(orderId).populate('items.productId');
  }

  async updateOrderStatus(
    orderId: string,
    status: OrderStatus
  ): Promise<IOrder | null> {
    return Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );
  }
} 
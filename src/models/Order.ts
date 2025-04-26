import mongoose, { Document, Schema } from 'mongoose';

export enum OrderStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export interface IOrderItem {
  productId: mongoose.Types.ObjectId;
  quantity: number;
  price: number;
  sourceUrl: string;
}

export interface IOrder extends Document {
  userId: mongoose.Types.ObjectId;
  items: IOrderItem[];
  totalAmount: number;
  status: OrderStatus;
  paymentId: string;
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema: Schema = new Schema({
  productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true },
  sourceUrl: { type: String, required: true }
});

const OrderSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  items: [OrderItemSchema],
  totalAmount: { type: Number, required: true },
  status: { 
    type: String, 
    enum: Object.values(OrderStatus),
    default: OrderStatus.PENDING 
  },
  paymentId: { type: String, required: true }
}, {
  timestamps: true
});

export default mongoose.model<IOrder>('Order', OrderSchema); 
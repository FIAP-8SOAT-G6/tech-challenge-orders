import mongoose, { Schema, Document } from "mongoose";

interface IItem {
  _id?: string;
  productId: number;
  productName: string;
  productDescription: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

interface IOrder extends Document {
  status: string;
  code: string;
  customerId: number;
  paymentStatus: string;
  items: IItem[];
  createdAt: Date;
}

const ItemSchema: Schema = new Schema({
  _id: { type: Schema.Types.ObjectId, auto: true },
  productId: { type: Number, required: true },
  productName: { type: String, required: true },
  productDescription: { type: String, required: true },
  quantity: { type: Number, required: true },
  unitPrice: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
});

const OrderSchema: Schema = new Schema({
  status: { type: String, required: true },
  code: { type: String, required: true },
  customerId: { type: Number, required: false },
  paymentStatus: { type: String, required: true },
  items: { type: [ItemSchema], default: [] },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IOrder>("Order", OrderSchema);

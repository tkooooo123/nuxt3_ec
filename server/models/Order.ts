import mongoose, { Schema, model, Types } from 'mongoose'

const OrderItemSchema = new Schema({
  product: { type: Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true }
}, { _id: false })

const ShippingSchema = new Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  email: { type: String, required: true },
  message: { type: String }
}, { _id: false })

const OrderSchema = new Schema({
  user: { type: Types.ObjectId, ref: 'User', required: true },
  items: { type: [OrderItemSchema], required: true },
  total: { type: Number, required: true },
  shipping: { type: ShippingSchema, required: true },
  status: { type: String, enum: ['pending', 'paid', 'shipped', 'completed', 'cancelled'], default: 'pending' },
  payment: { type: String, enum: ['credit_card', 'cash_on_delivery'], default: 'credit_card' }
}, {
  timestamps: true
})

export default mongoose.models.Order || model('Order', OrderSchema) 
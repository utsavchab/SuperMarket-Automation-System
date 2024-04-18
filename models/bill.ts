import mongoose, { Document, Schema } from 'mongoose'
import { ItemDocument } from './item'

export interface BillDocument extends Document {
  items: {
    item_code: number
    name: string
    quantity: number
    unit_price: number
  }[]
  total_cost: number
  date: Date
}

const billSchema = new Schema<BillDocument>({
  items: [
    {
      item_code: { type: Number },
      name: { type: String },
      quantity: { type: Number },
      unit_price: { type: Number },
    },
  ],
  total_cost: {
    type: Number,
  },
  date: {
    type: Date,
  },
})

export default mongoose.model<BillDocument>('Bill', billSchema)

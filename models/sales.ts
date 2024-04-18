import mongoose, { Document, Schema } from 'mongoose'

export interface SalesDocument extends Document {
  item_code: number
  item_name: string
  unit_price: number
  quantity: number
  date?: Date
}

const salesSchema = new Schema<SalesDocument>({
  item_code: {
    type: Number,
    required: true,
  },
  item_name: {
    type: String,
    required: true,
  },
  unit_price: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    default: 0,
  },
  date: {
    type: Date,
  },
})

export default mongoose.model<SalesDocument>('Sales', salesSchema)

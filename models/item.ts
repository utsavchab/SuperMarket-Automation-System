import mongoose, { Document, Schema } from 'mongoose'

export interface ItemDocument extends Document {
  item_name: string
  item_code: number
  quantity: number
  unit_price: number
  description: string
}

const itemSchema = new Schema<ItemDocument>({
  item_name: {
    type: String,
  },
  item_code: {
    type: Number,
  },
  quantity: {
    type: Number,
  },
  unit_price: {
    type: Number,
  },
  description: {
    type: String,
  },
})

export default mongoose.model<ItemDocument>('Item', itemSchema)

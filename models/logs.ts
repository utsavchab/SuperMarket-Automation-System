import mongoose from 'mongoose'

export interface LogsType {
  name: string
  username: string
  item_code: number
  item_name: string
  text: string
  user_type: 'Manager' | 'Clark' | 'Staff'
}
// Define the schema for the logs collection
const logSchema = new mongoose.Schema<LogsType>({
  name: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  item_code: {
    type: Number,
    required: true,
  },
  item_name: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  user_type: {
    type: String,
    required: true,
    enum: ['Manager', 'Clerk', 'Staff'],
  },
})

const Log = mongoose.model<LogsType>('Log', logSchema)

// Export the model
export default Log

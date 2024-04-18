import mongoose, { Schema, Document } from 'mongoose'
import passportLocalMongoose from 'passport-local-mongoose'

export interface UserDocument extends Document {
  name: string
  user_type: 'Manager' | 'Clerk' | 'Staff'
  joining_date: Date
}

const userSchema = new Schema<UserDocument>({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  user_type: {
    type: String,
    required: true,
    enum: ['Manager', 'Clerk', 'Staff'],
    default: 'Manager',
  },
  joining_date: {
    type: Date,
    required: true,
  },
})

userSchema.plugin(passportLocalMongoose)

export default mongoose.model<UserDocument>('User', userSchema)

import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
    email: string;
    password: string;
}

const userSchema = new Schema({
  name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
}, {
  timestamps: true
});

const User = mongoose.models.User || mongoose.model<IUser>('User', userSchema);

export default User;

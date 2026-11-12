import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  firebaseUid: { type: String, required: true, unique: true, index: true },
  email: { type: String, default: null, lowercase: true, trim: true },
  displayName: { type: String, default: "" },
  photoURL: { type: String, default: "" },
  emailVerified: { type: Boolean, default: false },
  signInProvider: { type: String, default: "" },
  lastSignInAt: { type: Date, default: null }
}, { timestamps: true });

export default mongoose.model("User", userSchema);

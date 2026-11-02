import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must contain at least 2 characters'],
      maxlength: [60, 'Name cannot exceed 60 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: [120, 'Email cannot exceed 120 characters'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      select: false,
    },
  },
  { timestamps: true }
);

userSchema.set('toJSON', {
  transform(_document, returnedObject) {
    delete returnedObject.password;
    delete returnedObject.__v;
    return returnedObject;
  },
});

const User = mongoose.model('User', userSchema);

export default User;

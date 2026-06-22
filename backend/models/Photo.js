import mongoose from 'mongoose';

const photoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  cloudinaryId: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['wedding', 'graduation', 'portrait', 'events', 'engagement', 'other'],
    lowercase: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Photo = mongoose.model('Photo', photoSchema);

export default Photo;
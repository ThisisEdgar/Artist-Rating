import mongoose from "mongoose";
const songSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    title: { type: String, required: true },
    artist: { type: String/* , ref: 'Artist' */, required: true },
    comments: { type: String, maxlength: 200 },
    rating: {type: Number, required: true}
  });
  export const Song = mongoose.model('Song', songSchema);
import mongoose from "mongoose";
const artistSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    name: { type: String, required: true },
    comments: { type: String, maxlength: 200 },
    rating: {type: Number, required: true}
  });
  export const Artist = mongoose.model('Artist', artistSchema);
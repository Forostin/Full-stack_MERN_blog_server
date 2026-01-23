import mongoose from 'mongoose';
 
const PostSchema = new mongoose.Schema({
    title: { type: String, required: true},
    text: { type: String, required: true},
    tags: { type: Array, default: [] },
    // comments: { type: Array, default: [] },
    imageUrl: { type: String, default: ''},
    viewsCount: { type: Number, default: 0},
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment'}],
  },
  {timestamps: true} 
)

export default mongoose.model('Post', PostSchema)
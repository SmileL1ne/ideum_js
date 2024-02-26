const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: { 
    en: { type: String, required: true },
    ru: { type: String, required: true }
  },
  content: { 
    en: { type: String, required: true },
    ru: { type: String, required: true }
  },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  imageUrl: { type: String }, 
  createdAt: { type: Date, default: Date.now }
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;

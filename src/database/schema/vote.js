const { Schema } = require("mongoose");
const mongoose = require("mongoose");

const voteSchema = new Schema({
  userId: { 
    type: String, 
    unique: true 
  },
  hasCollected: { 
    type: Boolean, 
    default: false 
  },
  hasVoted: { 
    type: Boolean, 
    default: false 
  },
  type: { 
    type: String 
  },
  query: { 
    type: String 
  },
  votedAt: { 
    type: Date, 
    default: Date.now 
  }
});

const VoteModel = mongoose.model('Vote', voteSchema, 'votes');

module.exports = VoteModel;
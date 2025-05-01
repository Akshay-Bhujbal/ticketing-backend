const mongoose = require('mongoose');

const teamMemberSchema = new mongoose.Schema({
  fullName: { 
    type: String, 
    default: '' 
  },
  phone: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    lowercase: true, 
    trim: true 
  },
  role: {
    type: String,
    enum: ['admin','member'],
    default: 'member'
  },

  password: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('TeamMember', teamMemberSchema);

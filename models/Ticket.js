const mongoose = require('mongoose')

const ticketSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },

    description: {
        type: String,
    },

    status: {
        type: String,
        enum: ['resolved', 'unresolved'],
        default: 'unresolved'
    },

    priority: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium'
    },

    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },

    raiserName: {
        type: String,
        required: true
    },
      
    raiserEmail: {
        type: String,
        required: true
    },
      
    raiserPhone: {
        type: String,
        required: true
    },

    ticketNumber: {
        type: String,
        unique: true
    },

},{
    timestamps: true
})

module.exports = mongoose.model('Ticket', ticketSchema);
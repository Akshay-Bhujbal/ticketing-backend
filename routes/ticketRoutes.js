const express = require('express')
const router = express.Router();
const {
    createTicket,
    getAllTickets,
    getTicketById,
    updateTicketStatus
} = require('../controllers/ticketController');

const {protect} = require('../middleware/auth');


router.post('/', protect, createTicket);
router.get('/', protect, getAllTickets);
router.get('/:id', protect, getTicketById);
router.patch('/:id/status', protect, updateTicketStatus);

module.exports = router;

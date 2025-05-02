const Ticket = require('../models/Ticket');

exports.createTicket = async (req, res) => {
    const {title, description, priority, raiserName, raiserPhone, raiserEmail, assignedTo} = req.body;

    try {
        const count = await Ticket.countDocuments();
        const ticketNumber = `2025-${(count + 1).toString().padStart(5, '0')}`;

        const ticket = await Ticket.create({
            title,
            description,
            priority,
            raiserName,
            raiserEmail,
            raiserPhone,
            assignedTo,
            createdBy:  req.user._id,
            ticketNumber
        });

        res.status(201).json(ticket);
    } catch (err) {
        res.status(500).json({message: err.message});
    }
};

exports.getAllTickets = async (req, res) => {
    try {
        const {status, search} = req.query;
        const filter = {};
        if (status && ['resolved', 'unresolved'].includes(status)) {
            filter.status = status;
        }

        if (search) {
            filter.$or = [
                {title: new RegExp(search, 'i')},
                {description: new RegExp(search, 'i')}
            ]
        }

        const tickets = await Ticket.find(filter)
        .populate('createdBy', 'firstName lastName email')
        .populate('assignedTo', 'firstName lastName email');

        res.json(tickets);
    } catch (err) {
        res.status(500).json({message: err.message});
    }
};

exports.getTicketById = async (req, res) => {
    try {
        const ticket = await Ticket.findById(req.params.id)
            .populate('createdBy', 'firstName lastName email')
            .populate('assignedTo', 'firstName lastName email')

        if (!ticket) return res.status(404).json({message: 'Ticket not found'});

        res.json(ticket);
    } catch (err) {
        res.status(500).json({message: err.message});
    }
};

exports.updateTicketStatus = async (req, res) => {
    const {status} = req.body;
    if(!['resolved', 'unresolved'].includes(status)) {
        return res.status(400).json({message: 'Invalid status value'})
    }

    try {
        const ticket = await Ticket.findByIdAndUpdate(
            req.params.id,
            {status},
            {new: true}
        )
        .populate('createdBy', 'firstName lastName email')
        .populate('assignedTo', 'firstName lastName email')
        if (!ticket) return res.status(404).json({message: 'Ticket not found'});
        res.json(ticket);
    } catch (err) {
        res.status(500).json({message: err.message});
    }
};
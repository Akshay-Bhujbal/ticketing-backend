const TeamMember = require('../models/TeamMember');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

exports.addTeamMember = async (req, res) => {
  try {
    const { username, email, phone, role} = req.body;

    const existingMember = await TeamMember.findOne({ email });
    if (existingMember) return res.status(400).json({ message: 'Member already exists' });

    const admin = await User.findById(req.user._id);
    if (!admin || admin.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const newMember = new TeamMember({
      username,
      fullName: '',
      email,
      phone,
      password: admin.password,
      role: role || 'member'
    });

    await newMember.save();

    res.status(201).json({ message: 'Member added successfully', member: newMember });
    
  } catch (err) {
    res.status(500).json({ message: 'Failed to add member' });
  }
};

exports.getAllMembers = async (req, res) => {
  try {
    const members = await TeamMember.find().sort({ createdAt: 1  }); 
    res.status(200).json(members);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch members' });
  }
};


exports.updateTeamMember = async (req, res) => {
  try {
    const updated = await TeamMember.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Member not found' });
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update member' });
  }
};

exports.deleteTeamMember = async (req, res) => {
  try {
    const deleted = await TeamMember.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Member not found' });
    res.status(200).json({ message: 'Member deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete member' });
  }
};

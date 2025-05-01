const User = require('../models/User');
const TeamMember = require('../models/TeamMember');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.signup = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    console.log("Received signup data:", req.body);

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const userCount = await User.countDocuments();
    const role = userCount === 0 ? 'admin' : 'member';
    const fullName = `${firstName} ${lastName}`;
    
    console.log("Creating User...");
    const newUser = new User({ firstName, lastName, fullName, email, password: hashedPassword, role });
    await newUser.save();

    console.log("Creating TeamMember...");
    await TeamMember.create({
      fullName,
      phone: '-', 
      email,
      password: hashedPassword,
      role,
    });

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.status(201).json({ user: newUser, token });
  } catch (err) {
    console.error("Signup Error:", err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.status(200).json({ user, token });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

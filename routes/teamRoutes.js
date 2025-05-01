const express = require('express');
const router = express.Router();
const {getAllMembers, addTeamMember, updateTeamMember, deleteTeamMember} = require('../controllers/teamController');
const {protect} = require('../middleware/auth');
const {allowRoles} = require('../middleware/roles');

router.use(protect);

router.get('/members', getAllMembers);
router.post('/members', allowRoles('admin'), addTeamMember);
router.put('/members/:id', allowRoles('admin'), updateTeamMember);
router.delete('/members/:id', allowRoles('admin'), deleteTeamMember);

module.exports = router;
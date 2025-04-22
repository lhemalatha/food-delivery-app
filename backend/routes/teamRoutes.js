const express = require('express');
const router = express.Router();
const teamController = require('../controllers/teamController');

// Get all team members
router.get('/', teamController.getAllTeamMembers);

// Get a specific team member by ID
router.get('/:id', teamController.getTeamMemberById);

// Add a new team member
router.post('/', teamController.createTeamMember);

// Update a team member
router.put('/:id', teamController.updateTeamMember);

// Delete a team member
router.delete('/:id', teamController.deleteTeamMember);

module.exports = router;

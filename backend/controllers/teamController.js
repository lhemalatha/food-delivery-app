const db = require('../config/db');

// Get all team members
exports.getAllTeamMembers = async (req, res) => {
  try {
    const [team] = await db.query('SELECT * FROM team');
    res.status(200).json(team);
  } catch (error) {
    console.error('Error fetching team:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Get a single team member by ID
exports.getTeamMemberById = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query('SELECT * FROM team WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Team member not found' });
    }
    res.status(200).json(rows[0]);
  } catch (error) {
    console.error('Error fetching team member:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Add a new team member
exports.createTeamMember = async (req, res) => {
  const { name, role, image } = req.body;
  try {
    await db.query(
      'INSERT INTO team (name, role, image) VALUES (?, ?, ?)',
      [name, role, image]
    );
    res.status(201).json({ message: 'Team member added successfully' });
  } catch (error) {
    console.error('Error adding team member:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Update a team member
exports.updateTeamMember = async (req, res) => {
  const { id } = req.params;
  const { name, role, image } = req.body;
  try {
    await db.query(
      'UPDATE team SET name = ?, role = ?, image = ? WHERE id = ?',
      [name, role, image, id]
    );
    res.status(200).json({ message: 'Team member updated successfully' });
  } catch (error) {
    console.error('Error updating team member:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Delete a team member
exports.deleteTeamMember = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM team WHERE id = ?', [id]);
    res.status(200).json({ message: 'Team member deleted successfully' });
  } catch (error) {
    console.error('Error deleting team member:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

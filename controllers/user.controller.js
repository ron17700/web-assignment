const User = require('../models/user.model');

const userController = {
    async getUsers(req, res){
        try {
            const users = await User.find();
            res.status(200).json(users);
        } catch (err) {
            res.status(400).json({ message: 'Error fetching users', error: err.message });
        }
    },

    async getUserById(req, res) {
        try {
            const user = await User.findById(req.params.id);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.status(200).json(user);
        } catch (err) {
            res.status(400).json({ message: 'Error fetching user', error: err.message });
        }
    },

    async updateUser(req, res){
        try {
            const { firstName, lastName, age, username, email } = req.body;

            if (username || email) {
                return res.status(400).json({ message: 'Updating username or email is not allowed' })
            }

            const user = await User.findByIdAndUpdate(
                req.params.id, { firstName, lastName, age },
                { new: true }
            );

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            res.status(200).json({
                message: 'User updated successfully',
                user
            });
        } catch (err) {
            res.status(400).json({ message: 'Error updating user', error: err.message });
        }
    },

    async deleteUser(req, res){
        try {
            const user = await User.findByIdAndDelete(req.params.id);

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            res.status(200).json({ message: 'User deleted successfully' });
        } catch (err) {
            res.status(400).json({ message: 'Error deleting user', error: err.message });
        }
    }
}

module.exports = userController;
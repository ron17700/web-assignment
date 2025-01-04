import { Request, Response } from 'express';
import User, { IUser } from '../models/user.model';

const userController = {
    async getUsers(req: Request, res: Response): Promise<void> {
        try {
            const users = await User.find();
            res.status(200).json(users);
        } catch (err) {
            res.status(400).json({
                message: 'Error fetching users',
                error: err instanceof Error ? err.message : 'Unknown error',
            });
        }
    },

    async getUserById(req: Request, res: Response): Promise<void> {
        try {
            const user = await User.findById(req.params.id);
            if (!user) {
                res.status(404).json({ message: 'User not found' });
                return;
            }
            res.status(200).json(user);
        } catch (err) {
            res.status(400).json({
                message: 'Error fetching user',
                error: err instanceof Error ? err.message : 'Unknown error',
            });
        }
    },

    async updateUser(req: Request, res: Response): Promise<void> {
        try {
            const { firstName, lastName, age, username, email } = req.body;

            if (username || email) {
                res.status(400).json({ message: 'Updating username or email is not allowed' });
                return;
            }

            const user = await User.findByIdAndUpdate(
                req.params.id,
                { firstName, lastName, age },
                { new: true }
            );

            if (!user) {
                res.status(404).json({ message: 'User not found' });
                return;
            }

            res.status(200).json({
                message: 'User updated successfully',
                user,
            });
        } catch (err) {
            res.status(400).json({
                message: 'Error updating user',
                error: err instanceof Error ? err.message : 'Unknown error',
            });
        }
    },

    async deleteUser(req: Request, res: Response): Promise<void> {
        try {
            const user = await User.findByIdAndDelete(req.params.id);

            if (!user) {
                res.status(404).json({ message: 'User not found' });
                return;
            }

            res.status(200).json({ message: 'User deleted successfully' });
        } catch (err) {
            res.status(400).json({
                message: 'Error deleting user',
                error: err instanceof Error ? err.message : 'Unknown error',
            });
        }
    },
};

export default userController;
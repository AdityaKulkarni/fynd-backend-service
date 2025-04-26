import User, { IUser } from '../models/User';
import jwt from 'jsonwebtoken';

export class UserService {
  async register(userData: { email: string; password: string; name: string }): Promise<{ user: IUser; token: string }> {
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
      throw new Error('Email already registered');
    }

    const user = new User(userData);
    await user.save();

    const token = this.generateToken(user);
    return { user, token };
  }

  async login(email: string, password: string): Promise<{ user: IUser; token: string }> {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new Error('Invalid credentials');
    }

    const token = this.generateToken(user);
    return { user, token };
  }

  private generateToken(user: IUser): string {
    return jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || 'your_jwt_secret_key_here',
      { expiresIn: '24h' }
    );
  }
} 
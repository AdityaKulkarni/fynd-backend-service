import { Request, Response } from 'express';
import { UserService } from '../services/UserService';

export class AuthController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  register = async (req: Request, res: Response): Promise<void> => {
    try {
      const { user, token } = await this.userService.register(req.body);
      res.status(201).json({ user, token });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  };

  login = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password } = req.body;
      const { user, token } = await this.userService.login(email, password);
      res.json({ user, token });
    } catch (error: any) {
      res.status(401).json({ message: error.message });
    }
  };
} 
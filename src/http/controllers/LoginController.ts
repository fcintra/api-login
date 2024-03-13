import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import UserRepository from '../../repositories/UserRepository';

const userRepository = new UserRepository()

class LoginController {
  public async login(req: Request, res: Response): Promise<void> {
    const { email, password } = req.body;

    try {
      // Verificar se o usuário existe no banco de dados
      const user = await userRepository.getByEmail(email);
      if (!user) {
        res.status(401).json({ error: 'Usuário não encontrado' });
        return;
      }

      // Verificar se a senha está correta
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        res.status(401).json({ error: 'Credenciais inválidas' });
        return;
      }

      // Gerar um token de autenticação JWT
      const token = jwt.sign({ userId: user.id }, 'superSecret', { expiresIn: '1h' });

      // Responder com o token
      res.json({ token });
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
}

export default LoginController;

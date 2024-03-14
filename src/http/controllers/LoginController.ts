import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import HttpStatusCode from '../../enums/HttpStatusCode';
import ErrorLogRepository from '../../repositories/ErrorLogRepository';
import RefreshTokenRepository from '../../repositories/RefreshTokenRepository';
import UserRepository from '../../repositories/UserRepository';


const errorLogRepository = new ErrorLogRepository();

const userRepository = new UserRepository();
const refreshTokenRepository = new RefreshTokenRepository();

const jwtSecret = process.env.JWT_SECRET;

if (!jwtSecret) {
    throw new Error('JWT secret not found in environment variables');
}

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

            // Verificar se o usuário já possui um token de atualização válido
            const refreshToken = await refreshTokenRepository.findByUserId(user.id);

            let newRefreshToken;

            if (!refreshToken || refreshToken.expiresAt < new Date()) {
                // Se não houver um token válido, gerar um novo
                newRefreshToken = jwt.sign({ userId: user.id }, jwtSecret!, { expiresIn: '7d' });
                try{
                  await refreshTokenRepository.create(newRefreshToken, user.id, new Date(Date.now() + 7 * 24 * 60 * 60 * 1000));
                } catch (error) {
                    console.error('Internal Server Error:', error);
                    try {
                      await errorLogRepository.create('Internal Server Error', error.message, error.stack);
                    } catch (dbError) {
                      console.error('Error saving error log to database:', dbError);
                    }
                  
                    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error' }); 
                    return
                }
            }

            // Gerar um token de autenticação JWT
            const authToken = jwt.sign({ userId: user.id }, jwtSecret!, { expiresIn: '1h' });

            // Responder com os tokens
            res.json({ authToken });

        } catch (error) {
            console.error('Erro ao fazer login:', error);
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }
}

export default LoginController;

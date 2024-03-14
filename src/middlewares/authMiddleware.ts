import { NextFunction, Request, Response } from 'express';
import jwt, { Secret } from 'jsonwebtoken';
import RefreshTokenRepository from '../repositories/RefreshTokenRepository';

const refreshTokenRepository = new RefreshTokenRepository();

const jwtSecret = process.env.JWT_SECRET;

if (!jwtSecret) {
    throw new Error('JWT secret not found in environment variables');
}


interface UserPayload {
    userId: string;
    exp: number; 
}

declare global {
    namespace Express {
        interface Request {
            user?: UserPayload;
        }
    }
}

const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Token de autenticação não fornecido' });
    }

    jwt.verify(token, jwtSecret as Secret, async (err, decoded: any) => {
        if (err) {
            console.error('Erro ao verificar o token de autenticação:', err.message);
            return res.status(403).json({ error: 'Token de autenticação inválido aqui'});
        }

        if (!isUserPayload(decoded)) {
            return res.status(403).json({ error: 'Formato de token inválido' });
        }

        // Verifique se o token JWT está prestes a expirar (por exemplo, nos próximos 5 minutos)
        const tokenExpirationThreshold = new Date(Date.now() + 5 * 60 * 1000);
        const isTokenExpiringSoon = new Date(decoded.exp * 1000) < tokenExpirationThreshold;

        if (isTokenExpiringSoon) {
            // Obtenha o refresh token do banco de dados
            const refreshToken = await refreshTokenRepository.findByUserId(decoded.userId);

            if (!refreshToken) {
                return res.status(401).json({ error: 'Não foi possível renovar o token: refresh token não encontrado' });
            }

            // Verifique se o refresh token está válido
            if (refreshToken.expiresAt < new Date()) {
                return res.status(401).json({ error: 'Não foi possível renovar o token: refresh token expirado' });
            }

            // Gere um novo token JWT
            const newToken = jwt.sign({ userId: decoded.userId }, jwtSecret, { expiresIn: '1h' });

            // Envie o novo token como resposta
            console.log(`'Authorization', Bearer ${newToken}`)
            res.set('Authorization', `Bearer ${newToken}`);
        }

        // Adicione os detalhes do usuário decodificado ao objeto de solicitação
        req.user = decoded as UserPayload;
        next();
    });
};

// Função auxiliar para verificar se um objeto possui a estrutura da interface UserPayload
const isUserPayload = (obj: any): obj is UserPayload => {
    return typeof obj === 'object' && typeof obj.userId === 'string';
};

export default authenticateToken;
import { RefreshToken } from '@prisma/client';
import { prisma } from '../lib/prisma';



class RefreshTokenRepository {
  async create(token: string, userId: string, expiresAt: Date): Promise<RefreshToken> {
    return prisma.refreshToken.create({
      data: {
        token,
        userId,
        expiresAt
      },
    });
  }

  async findByToken(token: string): Promise<RefreshToken | null> {
    const refreshToken = await prisma.refreshToken.findFirst({
      where: {
        token: token,
      },
    });
    
    if (!refreshToken) {
      return null; // Token não encontrado
    }
    
    // Verificar se o token ainda não expirou
    const isTokenExpired = refreshToken.expiresAt < new Date();
    
    if (isTokenExpired) {
      await prisma.refreshToken.delete({
        where: {
          id: refreshToken.id,
        },
      });
      return null;
    }
    
    return refreshToken;
  }

  async deleteByToken(token: string): Promise<void> {
    await prisma.refreshToken.deleteMany({
      where: {
        token,
      },
    });
  }

 
  async findByUserId(userId: string): Promise<RefreshToken | null> {
    const refreshToken = await prisma.refreshToken.findFirst({
        where: {
            userId,
        },
        orderBy: {
            createdAt: 'desc',
        },
        take: 1,
    });

    return refreshToken || null;
  }
}

export default RefreshTokenRepository;

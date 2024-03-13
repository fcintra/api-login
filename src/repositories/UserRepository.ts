// UserRepository.ts

import { User } from '@prisma/client';
import UserCreateInput from '../interfaces/UserCreateInput';
import { prisma } from '../lib/prisma'; // Importando a instância do PrismaClient

class UserRepository {
  constructor() {}

  public async getAll(): Promise<User[]> {
    return prisma.user.findMany();
  }

  public async getById(id: number): Promise<User | null> {
    return prisma.user.findUnique({
      where: { id },
    });
  }

  public async create(data: UserCreateInput): Promise<User> {
    return prisma.user.create({ data });
  }

  public async update(id: number, data: Partial<User>): Promise<User | null> {
    return prisma.user.update({
      where: { id },
      data,
    });
  }

  public async delete(id: number): Promise<User | null> {
    return prisma.user.delete({
      where: { id },
    });
  }
}

export default UserRepository;

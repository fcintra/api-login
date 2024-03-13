// UserRepository.ts

import { User } from '@prisma/client';
import UserCreateInput from '../interfaces/UserCreateInput';
import { prisma } from '../lib/prisma'; // Importando a instância do PrismaClient

class UserRepository {
  constructor() {}

  public async getAll(): Promise<User[]> {
    return prisma.user.findMany();
  }

  public async getById(id: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { id },
    });
  }

  public async getByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  public async create(data: UserCreateInput): Promise<User> {
    return prisma.user.create({ data });
  }

  public async update(id: string, data: Partial<User>): Promise<User | null> {
    return prisma.user.update({
      where: { id },
      data,
    });
  }

  public async delete(id: string): Promise<User | null> {
    return prisma.user.delete({
      where: { id },
    });
  }
}

export default UserRepository;

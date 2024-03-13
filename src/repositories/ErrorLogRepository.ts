import { prisma } from "../lib/prisma";

class ErrorLogRepository {

  public async create(type: string, message: string, stackTrace?: string): Promise<void> {
    try {
      // Criar um novo registro de log de erro no banco de dados
      await prisma.errorLog.create({
        data: {
          type,
          message,
          stackTrace,
        },
      });
    } catch (error) {
      // Se ocorrer um erro ao criar o registro, registre-o
      console.error('Erro ao criar registro de log de erro:', error);
      throw new Error('Erro ao criar registro de log de erro');
    }
  }
}

export default ErrorLogRepository;

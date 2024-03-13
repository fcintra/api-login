// UserController.ts

import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import HttpStatusCode from '../../enum/HttpStatusCode';
import UserRepository from '../../repositories/UserRepository';
import { isValidEmail } from '../../utils/validateEmail';



const userRepository = new UserRepository();

class UserController {
  public async index(req: Request, res: Response): Promise<void> {
    try {
        const users = await userRepository.getAll(); // Fetch all users
        res.json(users); // Send the users as a response
      } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' }); // Handle errors gracefully
      }
  }

  public async show(req: Request, res: Response): Promise<void> {
    const {id} = req.params
    try {
        const users = await userRepository.getById(id); 
        res.json(users); 
      } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
      }
  }

  public async store(req: Request, res: Response) {
    const {firstName, lastName, email, password} = req.body
    
    if (!firstName || !lastName || !email || !password) {
        res.status(400).json({ error: 'Todos os campos são obrigatórios' });
        return;
    }

    if (!isValidEmail(email)) {
        res.status(400).json({ error: 'Formato de e-mail inválido' });
        return;
    }

    if (password.length < 8) {
        res.status(400).json({ error: 'A senha deve ter pelo menos 8 caracteres' });
        return;
    }
      
    try {
        const existingUser = await userRepository.getByEmail(email);
        if (existingUser) {
          res.status(400).json({ error: 'Este e-mail já está cadastrado' });
          return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        
        const user = await userRepository.create({ firstName, lastName, email, password: hashedPassword });
        res.status(201).json(user);
    } catch (error) {
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  public async update(req: Request, res: Response): Promise<void> {
    const userId = req.params.id;
    const { firstName, lastName, email, password } = req.body;

    try {
      // Verificar se o usuário existe
      const existingUser = await userRepository.getById(userId);
      if (!existingUser) {
        res.status(404).json({ error: 'Usuário não encontrado' });
        return;
      }

      if (!isValidEmail(email)) {
        res.status(400).json({ error: 'Formato de e-mail inválido' });
        return;
      }

      if (password && password.length < 8) {
        res.status(400).json({ error: 'A senha deve ter pelo menos 8 caracteres' });
        return;
      }

      if (email && email !== existingUser.email) {
        const userWithSameEmail = await userRepository.getByEmail(email);
        if (userWithSameEmail) {
          res.status(400).json({ error: 'Este e-mail já está cadastrado' });
          return;
        }
      }

      // Atualizar os dados do usuário
      const updatedUserData = {
        firstName: firstName || existingUser.firstName,
        lastName: lastName || existingUser.lastName,
        email: email || existingUser.email,
        password: password ? await bcrypt.hash(password, 10) : existingUser.password // Atualizar senha apenas se fornecida
      };

      const updatedUser = await userRepository.update(userId, updatedUserData);

      res.status(200).json(updatedUser);
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  public async delete(req: Request, res: Response) {
    const {id} = req.params
    try{
      const verifyIfExistsUser = await userRepository.getById(id)

      if(!verifyIfExistsUser){
        res.status(404).json({ error: 'Usuário não encontrado' });
        return;
      }

      const result = await userRepository.delete(id);

      res.status(HttpStatusCode.NO_CONTENT).json(result)
    } catch (error){
      console.error('Erro ao atualizar usuário:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }

  }
}

export default UserController;

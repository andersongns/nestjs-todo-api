import { Injectable, NotFoundException } from '@nestjs/common';
import { TodoStatus } from './todo-status.enum';
import { CreateTodoDto } from './dto/create-todo.dto';
import { GetTodoFilterDto } from './dto/get-todo-filter.dto';
import { Todo } from './todo.entity';
import { TodoRepository } from './todo.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/user.entity';

@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(TodoRepository) private todoRepository: TodoRepository,
  ) {}

  getTodos(getTodoFilterDto: GetTodoFilterDto, user: User): Promise<Todo[]> {
    return this.todoRepository.getTodos(getTodoFilterDto, user);
  }

  async getTodoById(id: string, user: User): Promise<Todo> {
    const found = await this.todoRepository.findOne({ where: { id, user} });
    if (!found) throw new NotFoundException();
    return found;
  }

  async updateTodoStatusById(id: string, status: TodoStatus, user: User): Promise<Todo> {
    const todo = await this.getTodoById(id, user);
    todo.status = status;
    await this.todoRepository.save(todo);
    return todo;
  }

  create(createTodoDto: CreateTodoDto, user: User): Promise<Todo> {
    return this.todoRepository.createTodo(createTodoDto, user);
  }

  async deleteById(id: string, user: User): Promise<void> {
    const result = await this.todoRepository.delete({ id, user });
    if (result.affected === 0) throw new NotFoundException();
  }
}

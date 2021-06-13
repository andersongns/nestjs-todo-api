import { Injectable, NotFoundException } from '@nestjs/common';
import { TodoStatus } from './todo-status.enum';
import { CreateTodoDto } from './dto/create-todo.dto';
import { GetTodoFilterDto } from './dto/get-todo-filter.dto';
import { Todo } from './todo.entity';
import { TodoRepository } from './todo.repository';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(TodoRepository) private todoRepository: TodoRepository,
  ) {}

  getTodos(getTodoFilterDto: GetTodoFilterDto): Promise<Todo[]> {
    return this.todoRepository.getTodos(getTodoFilterDto);
  }

  async getTodoById(id: string): Promise<Todo> {
    const found = await this.todoRepository.findOne(id);
    if (!found) throw new NotFoundException();
    return found;
  }

  async updateTodoStatusById(id: string, status: TodoStatus): Promise<Todo> {
    const todo = await this.getTodoById(id);
    todo.status = status;
    await this.todoRepository.save(todo);
    return todo;
  }

  create(createTodoDto: CreateTodoDto): Promise<Todo> {
    return this.todoRepository.createTodo(createTodoDto);
  }

  async deleteById(id: string): Promise<void> {
    const result = await this.todoRepository.delete({ id });
    if (result.affected === 0) throw new NotFoundException();
  }
}

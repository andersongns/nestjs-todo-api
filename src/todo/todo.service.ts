import { Injectable, NotFoundException } from '@nestjs/common';
import { Todo, TodoStatus } from './todo.model';
import { v4 as uuid } from 'uuid';
import { CreateTodoDto } from './dto/create-todo.dto';
import { GetTodoFilterDto } from './dto/get-todo-filter.dto';

@Injectable()
export class TodoService {
  private todos: Todo[] = [];

  getTodos(): Todo[] {
    return this.todos;
  }

  getTodoById(id: string): Todo {
    const found = this.todos.find((todo) => todo.id === id);
    if (!found) throw new NotFoundException();
    return found;
  }

  getTodoWithFilter(getTodoFilterDto: GetTodoFilterDto): Todo[] {
    const { status, search } = getTodoFilterDto;
    let todos = this.getTodos();

    if (status) todos = todos.filter((todo) => todo.status === status);

    if (search)
      todos = todos.filter(
        (todo) =>
          todo.title.includes(search) || todo.description.includes(search),
      );
    return todos;
  }

  updateTodoStatusById(id: string, status: TodoStatus): void {
    this.getTodoById(id);
    this.todos = this.todos.map((todo) => {
      if (todo.id === id) todo.status = status;
      return todo;
    });
  }

  create(createTodoDto: CreateTodoDto): Todo {
    const { title, description } = createTodoDto;
    const todo: Todo = {
      id: uuid(),
      title,
      description,
      status: TodoStatus.OPEN,
    };

    this.todos.push(todo);
    return todo;
  }

  deleteById(id: string): void {
    this.getTodoById(id);
    this.todos = this.todos.filter((todo) => todo.id !== id);
  }
}

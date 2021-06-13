import { EntityRepository, Repository } from 'typeorm';
import { CreateTodoDto } from './dto/create-todo.dto';
import { GetTodoFilterDto } from './dto/get-todo-filter.dto';
import { TodoStatus } from './todo-status.enum';
import { Todo } from './todo.entity';

@EntityRepository(Todo)
export class TodoRepository extends Repository<Todo> {
  async createTodo(createTodoDto: CreateTodoDto): Promise<Todo> {
    const { title, description } = createTodoDto;
    const todo = this.create({
      title,
      description,
      status: TodoStatus.OPEN,
    });
    await this.save(todo);
    return todo;
  }

  async getTodos(getTodoFilterDto: GetTodoFilterDto): Promise<Todo[]> {
    const { status, search } = getTodoFilterDto;
    const query = this.createQueryBuilder('todo');
    if (status) query.andWhere('todo.status = :status', { status });
    if (search)
      query.andWhere(
        'LOWER(todo.title) LIKE LOWER(:search) or LOWER(todo.description) LIKE LOWER(:search) ',
        { search: `%${search}%` },
      );
    const todos = await query.getMany();
    return todos;
  }
}

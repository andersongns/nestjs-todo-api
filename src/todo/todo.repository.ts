import { User } from 'src/user/user.entity';
import { EntityRepository, Repository } from 'typeorm';
import { CreateTodoDto } from './dto/create-todo.dto';
import { GetTodoFilterDto } from './dto/get-todo-filter.dto';
import { TodoStatus } from './todo-status.enum';
import { Todo } from './todo.entity';

@EntityRepository(Todo)
export class TodoRepository extends Repository<Todo> {
  async createTodo(createTodoDto: CreateTodoDto, user: User): Promise<Todo> {
    const { title, description } = createTodoDto;
    const todo = this.create({
      title,
      description,
      status: TodoStatus.OPEN,
      user,
    });
    await this.save(todo);
    return todo;
  }

  async getTodos(getTodoFilterDto: GetTodoFilterDto, user: User): Promise<Todo[]> {
    const { status, search } = getTodoFilterDto;
    const query = this.createQueryBuilder('todos');
    query.andWhere(' todos.userId = :userId ', { userId: user.id })
    if (status) query.andWhere('todos.status = :status', { status });
    if (search)
      query.andWhere(
        '( LOWER(todos.title) LIKE LOWER(:search) or LOWER(todos.description) LIKE LOWER(:search) )',
        { search: `%${search}%` },
      );
    const todos = await query.getMany();
    return todos;
  }
}

import { User } from 'src/user/user.entity';
import { EntityRepository, Repository } from 'typeorm';
import { CreateTodoDto } from './dto/create-todo.dto';
import { GetTodoFilterDto } from './dto/get-todo-filter.dto';
import { TodoStatus } from './todo-status.enum';
import { Todo } from './todo.entity';
import { InternalServerErrorException, Logger } from '@nestjs/common'

@EntityRepository(Todo)
export class TodoRepository extends Repository<Todo> {
  private logger = new Logger(TodoRepository.name, true)
  async createTodo(createTodoDto: CreateTodoDto, user: User): Promise<Todo> {
    const { title, description } = createTodoDto;
    try {
      const todo = this.create({
        title,
        description,
        status: TodoStatus.OPEN,
        user,
      });
      await this.save(todo);
      return todo;
    } catch (error) {
      this.logger.error(`Failed to create todo for user ${user.username}. Params ${JSON.stringify(createTodoDto)}`, error.stack)
      throw new InternalServerErrorException();
    }
  }

  async getTodos(getTodoFilterDto: GetTodoFilterDto, user: User): Promise<Todo[]> {
    const { status, search } = getTodoFilterDto;

    try {
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
    } catch (error) {
      this.logger.error(`Failed to get todos for user ${user.username}. Filters ${JSON.stringify(getTodoFilterDto)}`, error.stack)
      throw new InternalServerErrorException();
    }
  }
}

import { IsEnum } from 'class-validator';
import { TodoStatus } from '../todo.model';

export class UpdateTodoStatusDto {
  @IsEnum(TodoStatus)
  status: TodoStatus;
}

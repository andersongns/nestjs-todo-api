import { TodoStatus } from '../todo.model';

export class GetTodoFilterDto {
  status?: TodoStatus;
  search?: string;
}

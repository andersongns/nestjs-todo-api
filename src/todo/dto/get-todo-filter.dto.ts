import { IsEnum, IsOptional, IsString } from 'class-validator'
import { TodoStatus } from '../todo-status.enum'

export class GetTodoFilterDto {
  @IsOptional()
  @IsEnum(TodoStatus)
  status?: TodoStatus

  @IsOptional()
  @IsString()
  search?: string
}

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo.dto';
import { GetTodoFilterDto } from './dto/get-todo-filter.dto';
import { Todo, TodoStatus } from './todo.model';
import { TodoService } from './todo.service';

@Controller('todos')
export class TodoController {
  constructor(private todoService: TodoService) {}

  @Get()
  getTodos(@Query() getTodoFilterDto: GetTodoFilterDto): Todo[] {
    if (Object.keys(getTodoFilterDto).length) {
      return this.todoService.getTodoWithFilter(getTodoFilterDto)
    }
    return this.todoService.getTodos();
  }

  @Get('/:id')
  getTodoById(@Param('id') id: string): Todo {
    return this.todoService.getTodoById(id);
  }

  @Patch('/:id/status')
  updateTodoStatusById(
    @Param('id') id: string,
    @Body() status: TodoStatus,
  ): void {
    this.todoService.updateTodoStatusById(id, status);
  }

  @Post()
  create(@Body() createTodoDto: CreateTodoDto): Todo {
    return this.todoService.create(createTodoDto);
  }

  @Delete('/:id')
  deleteById(@Param('id') id: string): void {
    this.todoService.deleteById(id);
  }
}

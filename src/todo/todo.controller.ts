import { UseGuards } from '@nestjs/common';
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
import { AuthGuard } from '@nestjs/passport';
import { CreateTodoDto } from './dto/create-todo.dto';
import { GetTodoFilterDto } from './dto/get-todo-filter.dto';
import { UpdateTodoStatusDto } from './dto/update-todo-status.dto';
import { Todo } from './todo.entity';
import { TodoService } from './todo.service';

@Controller('todos')
@UseGuards(AuthGuard())
export class TodoController {
  constructor(private todoService: TodoService) {}

  @Get()
  getTodos(@Query() getTodoFilterDto: GetTodoFilterDto): Promise<Todo[]> {
    return this.todoService.getTodos(getTodoFilterDto);
  }

  @Get('/:id')
  getTodoById(@Param('id') id: string): Promise<Todo> {
    return this.todoService.getTodoById(id);
  }

  @Patch('/:id/status')
  updateTodoStatusById(
    @Param('id') id: string,
    @Body() updateTodoStatusDto: UpdateTodoStatusDto,
  ): Promise<Todo> {
    const { status } = updateTodoStatusDto;
    return this.todoService.updateTodoStatusById(id, status);
  }

  @Post()
  create(@Body() createTodoDto: CreateTodoDto): Promise<Todo> {
    return this.todoService.create(createTodoDto);
  }

  @Delete('/:id')
  deleteById(@Param('id') id: string): Promise<void> {
    return this.todoService.deleteById(id);
  }
}

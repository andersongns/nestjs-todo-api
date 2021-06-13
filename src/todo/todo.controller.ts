import { Req, UseGuards } from '@nestjs/common';
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
import { GetUserDecorator } from 'src/auth/auth.decorator';
import { User } from 'src/user/user.entity';
import { CreateTodoDto } from './dto/create-todo.dto';
import { GetTodoFilterDto } from './dto/get-todo-filter.dto';
import { UpdateTodoStatusDto } from './dto/update-todo-status.dto';
import { Todo } from './todo.entity';
import { TodoService } from './todo.service';
import { Logger } from '@nestjs/common';

@Controller('todos')
@UseGuards(AuthGuard())
export class TodoController {
  private logger = new Logger(TodoController.name);
  constructor(private todoService: TodoService) {}

  @Get()
  getTodos(@Query() getTodoFilterDto: GetTodoFilterDto, @GetUserDecorator() user: User): Promise<Todo[]> {
    this.logger.verbose(`user ${user.username} get all todos with filter ${JSON.stringify(getTodoFilterDto)}`)
    return this.todoService.getTodos(getTodoFilterDto, user);
  }

  @Get('/:id')
  getTodoById(@Param('id') id: string, @GetUserDecorator() user: User): Promise<Todo> {
    this.logger.verbose(`user ${user.username} try to get todo ${id}`)
    return this.todoService.getTodoById(id, user);
  }

  @Patch('/:id/status')
  updateTodoStatusById(
    @Param('id') id: string,
    @Body() updateTodoStatusDto: UpdateTodoStatusDto,
    @GetUserDecorator() user: User,
  ): Promise<Todo> {
    this.logger.verbose(`user ${user.username} try to update todo ${id} with status ${JSON.stringify(updateTodoStatusDto)}`);
    const { status } = updateTodoStatusDto;
    return this.todoService.updateTodoStatusById(id, status, user);
  }

  @Post()
  create(@Body() createTodoDto: CreateTodoDto, @GetUserDecorator() user: User): Promise<Todo> {
    this.logger.verbose(`user ${user.username} try to create todo ${JSON.stringify(createTodoDto)}`);
    return this.todoService.create(createTodoDto, user);
  }

  @Delete('/:id')
  deleteById(@Param('id') id: string, @GetUserDecorator() user: User): Promise<void> {
    this.logger.verbose(`user ${user.username} try to delete todo ${id}}`);
    return this.todoService.deleteById(id, user);
  }
}

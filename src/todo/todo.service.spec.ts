import { NotFoundException } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { User } from '../user/user.entity'
import { CreateTodoDto } from './dto/create-todo.dto'
import { GetTodoFilterDto } from './dto/get-todo-filter.dto'
import { TodoStatus } from './todo-status.enum'
import { Todo } from './todo.entity'
import { TodoRepository } from './todo.repository'
import { TodoService } from './todo.service'
import * as faker from 'faker';

const mockTodoRepository = () => ({
  getTodos: jest.fn(),
  getTodoById: jest.fn(),
  createTodo: jest.fn(),
  findOne: jest.fn()
})

describe('Todo Service', () => {
  let todoService: TodoService
  let todoRepository: TodoRepository

  const user: User = {
    id: faker.datatype.uuid(),
    password: faker.internet.password(8),
    username: faker.internet.userName(),
    todos: []
  }

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        TodoService,
        { provide: TodoRepository, useFactory: mockTodoRepository }
      ]
    }).compile()

    todoService = await module.get(TodoService)
    todoRepository = module.get(TodoRepository)
  })

  describe('Get Todo', () => {
    it('Should return empty array when not found todos', async () => {
      todoRepository.getTodos = jest.fn().mockReturnValue([])
      expect(todoRepository.getTodos).not.toHaveBeenCalled()
      const result = await todoService.getTodos({}, user)
      expect(todoRepository.getTodos).toHaveBeenCalled()
      expect(result).toEqual([])
    })

    it('Should return todo items when found todos', async () => {
      const mockTodo: Todo = {
        id: 'valid_id',
        title: 'valid_title',
        status: TodoStatus.OPEN,
        description: 'valid_description',
        created_at: new Date(),
        updated_at: new Date(),
        user
      }
      todoRepository.getTodos = jest.fn().mockReturnValue([mockTodo])
      expect(todoRepository.getTodos).not.toHaveBeenCalled()
      const result = await todoService.getTodos({}, user)
      expect(todoRepository.getTodos).toHaveBeenCalled()
      expect(result).toEqual([mockTodo])
    })

    it('Should return OPEN todo when status filter is set OPEN', async () => {
      const mockTodo: Todo = {
        id: 'valid_id',
        title: 'valid_title',
        status: TodoStatus.OPEN,
        description: 'valid_description',
        created_at: new Date(),
        updated_at: new Date(),
        user
      }
      const filter: GetTodoFilterDto = {
        status: TodoStatus.OPEN
      }
      todoRepository.getTodos = jest.fn().mockReturnValue([mockTodo])
      expect(todoRepository.getTodos).not.toHaveBeenCalled()
      const result = await todoService.getTodos(filter, user)
      expect(todoRepository.getTodos).toHaveBeenCalled()
      expect(result).toEqual([mockTodo])
      expect(result[0].status).toEqual(TodoStatus.OPEN)
    })

    it('Should return a todo when valid id is provided', async () => {
      const mockTodo: Todo = {
        id: 'valid_id',
        title: 'valid_title',
        status: TodoStatus.OPEN,
        description: 'valid_description',
        created_at: new Date(),
        updated_at: new Date(),
        user
      }
      todoRepository.findOne = jest.fn().mockReturnValue(mockTodo)
      expect(todoRepository.findOne).not.toHaveBeenCalled()
      const result = await todoService.getTodoById('valid_id', user)
      expect(todoRepository.findOne).toHaveBeenCalled()
      expect(result).toEqual(mockTodo)
    })

    it('Should throws NotFoundException when not found id', async () => {
      todoRepository.findOne = jest.fn().mockReturnValue(null)
      expect(todoRepository.findOne).not.toHaveBeenCalled()
      const result = todoService.getTodoById('invalid_id', user)
      expect(result).rejects.toThrow(new NotFoundException())
      expect(todoRepository.findOne).toHaveBeenCalled()
    })
  })

  describe('Create Todo', () => {

    it('Calls taskRepository.createTodo with correct params', async () => {
      const mockCreateTodoDto: CreateTodoDto = {
        title: faker.random.word(),
        description: faker.random.words(5)
      }
      expect(todoRepository.createTodo).not.toHaveBeenCalled()
      await todoService.create(mockCreateTodoDto, user)
      expect(todoRepository.createTodo).toHaveBeenCalledWith(mockCreateTodoDto, user)
    })

  })

  describe('Update Todo', () => {
    it('Calls taskRepository.updateTodoStatusById with correct params', async () => {
      const mockCreateTodoDto: CreateTodoDto = {
        title: faker.random.word(),
        description: faker.random.words(5)
      }
      expect(todoService.getTodoById).not.toHaveBeenCalled()
      expect(todoRepository.save).not.toHaveBeenCalled()
      await todoService.updateTodoStatusById('valid_id',TodoStatus.IN_PROGRESS, user)
      expect(todoRepository.createTodo).toHaveBeenCalledWith(mockCreateTodoDto, user)
    })
  })

  describe('Delete Todo', () => {
    // TODO
  })
})

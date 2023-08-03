import { NotFoundException } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { TaskStatus } from "./task-status.enum";
import { TaskRepository } from "./tasks.repository";
import { TasksService } from "./tasks.service";

const mockTaskRepo = () => ({
    getTasks: jest.fn(),
    getTaskById: jest.fn(),
});

const mockUser = {
    id: 'id',
    username: 'jaytailor45',
    password: 'password',
    tasks: [],
}

describe('Tasks service', () => {
    let taskService: TasksService;
    let taskRepo;

    beforeEach(async () => {
        // initialize nestjs modules with tasksService and taskRepo
        const module = await Test.createTestingModule({
            providers: [
                TasksService,
                { provide: TaskRepository, useFactory: mockTaskRepo },
            ],
        }).compile();

        taskService = module.get(TasksService);
        taskRepo = module.get(TaskRepository);
    });


    describe('getTasks', () => {
        it('calls TaskRepository.getTasks and return the result', async () => {
            taskRepo.getTasks.mockResolvedValue('...')
            const result = await taskService.getTasks(null, mockUser);
            expect(result).toEqual('...');
        });
    });

    describe('getTaskById', () => {
        it('calls TaskRepository.getTaskById and return the result', async () => {
            const mockTask = {
                id: 'id',
                title: 'Task title',
                description: 'Task desc',
                status: TaskStatus.OPEN,
            }

            taskRepo.getTaskById.mockResolvedValue(mockTask);

            const result = await taskService.getTaskById('id', mockUser);
            expect(result).toEqual(mockTask);
        });

        // it('calls TaskRepository.getTaskById and return the error', async () => {
        //     taskRepo.getTaskById.mockResolvedValue(null);
        //     expect(taskService.getTaskById('id', mockUser)).rejects.toThrow(NotFoundException);
        // });
    })

});
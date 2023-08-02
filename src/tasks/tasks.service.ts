import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './task-status.enum';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskRepository } from './tasks.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { User } from 'src/auth/user.entity';

@Injectable()
export class TasksService {
    constructor(
        @InjectRepository(TaskRepository)
        private tasksRepo: TaskRepository,
    ) {}

    getTasks(filterDto: GetTasksFilterDto, user: User): Promise<Task[]> {
        return this.tasksRepo.getTasks(filterDto, user);
    }

    createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
        return this.tasksRepo.createTask(createTaskDto, user);
    }

    async getTaskById(id: string, user: User): Promise<Task> {
        return this.tasksRepo.getTaskById(id, user);
    }

    async deleteTaskById(id: string, user: User): Promise<void> {
        const result = await this.tasksRepo.delete({ id, user });
        if(result.affected === 0) {
            throw new NotFoundException(`Task with the id ${id} does not found`);
        }
    }

    async updateTaskStatus(id: string, status: TaskStatus, user: User): Promise<Task> {
        const task = await this.getTaskById(id, user);
        task.status = status;
        await this.tasksRepo.save(task);
        return task;
    }
}

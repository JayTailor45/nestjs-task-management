import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './task-status.enum';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskRepository } from './tasks.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';

@Injectable()
export class TasksService {
    constructor(
        @InjectRepository(TaskRepository)
        private tasksRepo: TaskRepository,
    ) {}

    getTasks(filterDto: GetTasksFilterDto): Promise<Task[]> {
        return this.tasksRepo.getTasks(filterDto);
    }

    createTask(createTaskDto: CreateTaskDto): Promise<Task> {
        return this.tasksRepo.createTask(createTaskDto);
    }

    async getTaskById(id: string): Promise<Task> {
        return this.tasksRepo.getTaskById(id);
    }

    async deleteTaskById(id: string): Promise<void> {
        const result = await this.tasksRepo.delete(id);
        if(result.affected === 0) {
            throw new NotFoundException(`Task with the id ${id} does not found`);
        }
    }

    async updateTaskStatus(id: string, status: TaskStatus): Promise<Task> {
        const task = await this.getTaskById(id);
        task.status = status;
        await this.tasksRepo.save(task);
        return task;
    }
}

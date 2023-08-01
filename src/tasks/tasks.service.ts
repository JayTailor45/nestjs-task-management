import { Injectable, NotFoundException } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';
import { v4 as uuid } from 'uuid';
import { CreateTaskDto } from './dto/create-task.dto';

@Injectable()
export class TasksService {
    private tasks: Task[] = [];

    getAllTasks(): Task[] {
        return this.tasks;
    }

    createTask(createTaskDto: CreateTaskDto): Task {
        const {title, description} = createTaskDto;
        const task: Task = {
            id: uuid(),
            title,
            description,
            status: TaskStatus.OPEN,
        }

        this.tasks.push(task);

        return task;
    }

    getTaskById(id: string): Task {
        const task = this.tasks.find(task => task.id === id);
        if(!task) {
            throw new NotFoundException(`Task with the id ${id} does not found`);
        }
        return task;
    }

    deleteTaskById(id: string): Task[] {
        const task = this.tasks.find(task => task.id === id);
        if(!task) {
            throw new NotFoundException(`Task with the id ${id} does not found`);
        }
        this.tasks = this.tasks.filter(task => task.id !== id);
        return this.tasks;
    }
}

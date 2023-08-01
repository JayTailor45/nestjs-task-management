import { Injectable, NotFoundException } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';
import { v4 as uuid } from 'uuid';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';

@Injectable()
export class TasksService {
    private tasks: Task[] = [];

    getAllTasks(): Task[] {
        return this.tasks;
    }

    getTasksWithFilter(filterDto: GetTasksFilterDto): Task[] {
        const {search, status} = filterDto;
        let tasks = this.getAllTasks();
        if(status) {
            tasks = tasks.filter(task => task.status === status);
        }
        if(search) {
            const searchTerm = search.toLocaleLowerCase();
            tasks = tasks.filter(task => (
                task.description.toLowerCase().includes(searchTerm) ||
                task.title.toLowerCase().includes(searchTerm))
            );
        }
        return tasks;
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

    updateTaskStatus(id: string, status: TaskStatus): Task {
        const task = this.getTaskById(id);
        if(!task) {
            throw new NotFoundException(`Task with the id ${id} does not found`);
        }
        task.status = status;
        return task;
    }
}

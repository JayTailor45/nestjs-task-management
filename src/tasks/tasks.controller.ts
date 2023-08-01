import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { Task, TaskStatus } from './task.model';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
    constructor(
        private tasksService: TasksService,
    ) {}

    @Get()
    getAllTasks(): Task[] {
        return this.tasksService.getAllTasks();
    }

    @Post()
    createTask(
        @Body() createTaskDto: CreateTaskDto,
    ) {
        return this.tasksService.createTask(createTaskDto);
    }

    @Get('/:id')
    getTaskById(
        @Param('id') id,
    ): Task {
        return this.tasksService.getTaskById(id);
    }

    @Delete('/:id')
    deleteTaskById(
        @Param('id') id,
    ): Task[] {
        return this.tasksService.deleteTaskById(id);
    }

    @Patch('/:id')
    updateTaskStatus(
        @Param('id') id,
        @Body('status') status: TaskStatus,
    ): Task {
        return this.tasksService.updateTaskStatus(id, status);
    }

}

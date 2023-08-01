import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { Task, TaskStatus } from './task.model';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
    constructor(
        private tasksService: TasksService,
    ) {}

    @Get()
    getTasks(
        @Query() getTasksFilterDto: GetTasksFilterDto
    ): Task[] {
        if(Object.keys(getTasksFilterDto).length) {
            return this.tasksService.getTasksWithFilter(getTasksFilterDto);
        } else {
            return this.tasksService.getAllTasks();
        }
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

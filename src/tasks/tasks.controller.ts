import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { UpdateTaskStatusDto } from './dto/update-task.dto';
import { TaskStatus } from './task-status.enum';
import { Task } from './task.entity';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
    constructor(
        private tasksService: TasksService,
    ) {}

    @Get()
    getTasks(
        @Query() getTasksFilterDto: GetTasksFilterDto
    ): Promise<Task[]> {
        return this.tasksService.getTasks(getTasksFilterDto);
    }

    @Post()
    createTask(
        @Body() createTaskDto: CreateTaskDto,
    ): Promise<Task> {
        return this.tasksService.createTask(createTaskDto);
    }

    @Get('/:id')
    getTaskById(
        @Param('id') id,
    ): Promise<Task> {
        return this.tasksService.getTaskById(id);
    }

    @Delete('/:id')
    deleteTaskById(
        @Param('id') id,
    ): Promise<void> {
        return this.tasksService.deleteTaskById(id);
    }

    @Patch('/:id')
    updateTaskStatus(
        @Param('id') id,
        @Body() updateTaskStatusDto: UpdateTaskStatusDto,
    ): Promise<Task> {
        const { status } = updateTaskStatusDto;
        return this.tasksService.updateTaskStatus(id, status);
    }

}

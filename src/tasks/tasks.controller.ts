import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { getUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { UpdateTaskStatusDto } from './dto/update-task.dto';
import { Task } from './task.entity';
import { TasksService } from './tasks.service';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
    constructor(
        private tasksService: TasksService,
    ) {}

    @Get()
    getTasks(
        @Query() getTasksFilterDto: GetTasksFilterDto,
        @getUser() user: User,
    ): Promise<Task[]> {
        return this.tasksService.getTasks(getTasksFilterDto, user);
    }

    @Post()
    createTask(
        @Body() createTaskDto: CreateTaskDto,
        @getUser() user: User,
    ): Promise<Task> {
        return this.tasksService.createTask(createTaskDto, user);
    }

    @Get('/:id')
    getTaskById(
        @Param('id') id,
        @getUser() user: User,
    ): Promise<Task> {
        return this.tasksService.getTaskById(id, user);
    }

    @Delete('/:id')
    deleteTaskById(
        @Param('id') id,
        @getUser() user: User,
    ): Promise<void> {
        return this.tasksService.deleteTaskById(id, user);
    }

    @Patch('/:id')
    updateTaskStatus(
        @Param('id') id,
        @Body() updateTaskStatusDto: UpdateTaskStatusDto,
        @getUser() user: User,
    ): Promise<Task> {
        const { status } = updateTaskStatusDto;
        return this.tasksService.updateTaskStatus(id, status, user);
    }

}

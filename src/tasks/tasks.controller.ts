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
        @Query() getTasksFilterDto: GetTasksFilterDto
    ): Promise<Task[]> {
        return this.tasksService.getTasks(getTasksFilterDto);
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

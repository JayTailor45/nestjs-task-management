import { Body, Controller, Delete, Get, Logger, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
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
    private logger = new Logger('TasksController');

    constructor(
        private tasksService: TasksService,
    ) {}

    @Get()
    getTasks(
        @Query() getTasksFilterDto: GetTasksFilterDto,
        @getUser() user: User,
    ): Promise<Task[]> {
        this.logger.verbose(`User ${user.username} is retrieving all tasks. Filters: ${JSON.stringify(getTasksFilterDto)}`);
        return this.tasksService.getTasks(getTasksFilterDto, user);
    }

    @Post()
    createTask(
        @Body() createTaskDto: CreateTaskDto,
        @getUser() user: User,
    ): Promise<Task> {
        this.logger.verbose(`User ${user.username} is a new task. Data: ${JSON.stringify(createTaskDto)}`);
        return this.tasksService.createTask(createTaskDto, user);
    }

    @Get('/:id')
    getTaskById(
        @Param('id') id,
        @getUser() user: User,
    ): Promise<Task> {
        this.logger.verbose(`User ${user.username} is retrieving task ${id}`);
        return this.tasksService.getTaskById(id, user);
    }

    @Delete('/:id')
    deleteTaskById(
        @Param('id') id,
        @getUser() user: User,
    ): Promise<void> {
        this.logger.verbose(`User ${user.username} is deleting task ${id}`);
        return this.tasksService.deleteTaskById(id, user);
    }

    @Patch('/:id')
    updateTaskStatus(
        @Param('id') id,
        @Body() updateTaskStatusDto: UpdateTaskStatusDto,
        @getUser() user: User,
    ): Promise<Task> {
        const { status } = updateTaskStatusDto;
        this.logger.verbose(`User ${user.username} is updating status of task ${id}`);
        return this.tasksService.updateTaskStatus(id, status, user);
    }

}

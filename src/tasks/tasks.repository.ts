import { Injectable, InternalServerErrorException, Logger, NotFoundException } from "@nestjs/common";
import { User } from "src/auth/user.entity";
import { DataSource, Repository } from "typeorm";
import { CreateTaskDto } from "./dto/create-task.dto";
import { GetTasksFilterDto } from "./dto/get-tasks-filter.dto";
import { TaskStatus } from "./task-status.enum";
import { Task } from "./task.entity";

@Injectable()
export class TaskRepository extends Repository<Task> {
    // https://github.com/typeorm/typeorm/issues/9389#issuecomment-1263235683

    private logger = new Logger('TaskRepository', {timestamp: true});

    constructor(private dataSource: DataSource) {
        super(Task, dataSource.createEntityManager())
    }

    async getTasks(filterDto: GetTasksFilterDto, user: User): Promise<Task[]> {
        const {search, status} = filterDto;
        const query = this.createQueryBuilder('task');
        query.where({ user });
        if(status) {
            query.andWhere('task.status = :status', { status });
        }
        if(search) {
            query.andWhere(
                '(LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search))',
                { search: `%${search}%` },
            );
        }
        try {
            const tasks = await query.getMany();
            return tasks;
        } catch (error) {
            this.logger.error(`Failed to get tasks for user ${user.username}. Filters: ${JSON.stringify(filterDto)}`, error.stack)
            throw new InternalServerErrorException();
        }
    }

    async getTaskById(id: string, user: User) {
        const task = await this.findOneBy({ id, user });
        if(!task) {
            this.logger.error(`Failed to get task ${id} for user ${user.username}`)
            throw new NotFoundException(`Task with the id ${id} does not found`);
        }
        return task;
    }

    async createTask(createTaskDto: CreateTaskDto, user: User) {
        const {title, description} = createTaskDto;
        const task = this.create({
            title,
            description,
            status: TaskStatus.OPEN,
            user: user,
        });
        try {
            await this.save(task);
            return task;
        } catch (error) {
            this.logger.error(`Failed to add task for user ${user.username}. Data: ${JSON.stringify(createTaskDto)}`, error.stack)
            throw new InternalServerErrorException();
        }
    }

}
import { Injectable, NotFoundException } from "@nestjs/common";
import { User } from "src/auth/user.entity";
import { DataSource, Repository } from "typeorm";
import { CreateTaskDto } from "./dto/create-task.dto";
import { GetTasksFilterDto } from "./dto/get-tasks-filter.dto";
import { TaskStatus } from "./task-status.enum";
import { Task } from "./task.entity";

@Injectable()
export class TaskRepository extends Repository<Task> {
    // https://github.com/typeorm/typeorm/issues/9389#issuecomment-1263235683

    constructor(private dataSource: DataSource) {
        super(Task, dataSource.createEntityManager())
    }

    async getTasks(filterDto: GetTasksFilterDto): Promise<Task[]> {
        const {search, status} = filterDto;
        const query = this.createQueryBuilder('task');
        if(status) {
            query.andWhere('task.status = :status', { status });
        }
        if(search) {
            query.andWhere(
                'LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search)',
                { search: `%${search}%` },
            );
        }
        const tasks = await query.getMany();
        return tasks;
    }

    async getTaskById(id: string) {
        const task = await this.findOneBy({ id });
        if(!task) {
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
        await this.save(task);
        return task;
    }

}
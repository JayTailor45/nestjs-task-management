import { Injectable } from '@nestjs/common';

@Injectable()
export class TasksService {
    private readonly tasks = [];

    getAllTasks() {
        return this.tasks;
    }
}

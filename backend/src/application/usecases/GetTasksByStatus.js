import { TaskStatus } from '../../domain/value_objects/TaskStatus.js';
import { TaskResponse } from '../dtos/TaskResponse.js';

export class GetTasksByStatus {
  constructor(taskRepository) {
    this.taskRepository = taskRepository;
  }

  async execute(status) {
    const taskStatus =
      status instanceof TaskStatus ? status : new TaskStatus(status);
    const tasks = await this.taskRepository.findByStatus(taskStatus);
    return TaskResponse.fromTasks(tasks);
  }
}

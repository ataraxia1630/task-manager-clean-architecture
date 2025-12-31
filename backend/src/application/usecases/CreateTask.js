import { Task } from '../../domain/entities/Task.js';
import { TaskResponse } from '../dtos/TaskResponse.js';

export class CreateTask {
  constructor(taskRepository) {
    this.taskRepository = taskRepository;
  }

  async execute(request) {
    const task = new Task(null, request.title, request.description, 'TODO');
    await this.taskRepository.save(task);
    return new TaskResponse(task);
  }
}

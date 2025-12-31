import { TaskId } from '../../domain/value_objects/TaskId.js';
import { TaskResponse } from '../dtos/TaskResponse.js';

export class UpdateTaskStatus {
  constructor(taskRepository) {
    this.taskRepository = taskRepository;
  }

  async execute(id, newStatus) {
    const taskId = id instanceof TaskId ? id : new TaskId(id);
    const task = await this.taskRepository.findById(taskId);
    if (!task) {
      throw new Error('Task not found');
    }
    task.updateStatus(newStatus);
    await this.taskRepository.save(task);
    return new TaskResponse(task);
  }
}

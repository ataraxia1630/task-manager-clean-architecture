import { TaskId } from '../../domain/value_objects/TaskId.js';

export class DeleteTask {
  constructor(taskRepository) {
    this.taskRepository = taskRepository;
  }

  async execute(id) {
    const taskId = id instanceof TaskId ? id : new TaskId(id);
    await this.taskRepository.delete(taskId);
  }
}

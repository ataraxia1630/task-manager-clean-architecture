export class TaskResponse {
  constructor(task) {
    this.id = task.id.value;
    this.title = task.title;
    this.description = task.description;
    this.status = task.status.value;
    this.createdAt = task.createdAt;
  }

  static fromTasks(tasks) {
    return tasks.map((task) => new TaskResponse(task));
  }
}

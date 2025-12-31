import { TaskStatus } from '../value_objects/TaskStatus.js';
import { TaskId } from '../value_objects/TaskId.js';

export class Task {
  constructor(id, title, description, status, createdAt) {
    this.id = new TaskId(id);
    this.title = title;
    this.description = description;
    this.status = new TaskStatus(status);
    this.createdAt = createdAt || new Date();

    this._validate();
  }

  _validate() {
    if (!this.title || this.title.trim() === '') {
      throw new Error('Title cannot be empty');
    }
  }

  updateStatus(newStatus) {
    const current = this.status.value;
    const next = new TaskStatus(newStatus).value;

    if (current === 'DONE' && next === 'TODO') {
      throw new Error('Cannot change from DONE to TODO');
    }

    this.status = new TaskStatus(next);
  }

  toJSON() {
    return {
      id: this.id.value,
      title: this.title,
      description: this.description,
      status: this.status.value,
      createdAt: this.createdAt,
    };
  }
}

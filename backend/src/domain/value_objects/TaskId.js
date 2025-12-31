import { v4 as uuidv4 } from 'uuid';

export class TaskId {
  constructor(value) {
    this.value = value ?? uuidv4();
    if (!this.value) {
      throw new Error('Invalid TaskId');
    }
  }
}

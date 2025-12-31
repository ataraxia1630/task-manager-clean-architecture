const VALID_STATUSES = ['TODO', 'DOING', 'DONE'];

export class TaskStatus {
  constructor(value) {
    this.value = value.toUpperCase();
    if (!VALID_STATUSES.includes(this.value)) {
      throw new Error(
        `Invalid status: ${value}. Must be one of ${VALID_STATUSES.join(', ')}`
      );
    }
  }
}

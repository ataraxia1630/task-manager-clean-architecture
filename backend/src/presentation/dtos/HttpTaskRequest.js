export class HttpCreateTaskRequest {
  constructor(body) {
    this.title = body.title;
    this.description = body.description;
  }
}

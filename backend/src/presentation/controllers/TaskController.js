import express from 'express';
import { CreateTask } from '../../application/usecases/CreateTask.js';
import { UpdateTaskStatus } from '../../application/usecases/UpdateTaskStatus.js';
import { GetTasksByStatus } from '../../application/usecases/GetTasksByStatus.js';
import { DeleteTask } from '../../application/usecases/DeleteTask.js';
import { CreateTaskRequest } from '../../application/dtos/CreateTaskRequest.js';
import { HttpCreateTaskRequest } from '../dtos/HttpTaskRequest.js';

export class TaskController {
  constructor(taskRepository) {
    this.createTask = new CreateTask(taskRepository);
    this.updateTaskStatus = new UpdateTaskStatus(taskRepository);
    this.getTasksByStatus = new GetTasksByStatus(taskRepository);
    this.deleteTask = new DeleteTask(taskRepository);
    this.router = express.Router();
    this._initRoutes();
  }

  _initRoutes() {
    this.router.post('/tasks', async (req, res) => {
      try {
        const httpReq = new HttpCreateTaskRequest(req.body);
        const appReq = new CreateTaskRequest(
          httpReq.title,
          httpReq.description
        );
        const response = await this.createTask.execute(appReq);
        res.status(201).json(response);
      } catch (err) {
        res.status(400).json({ error: err.message });
      }
    });

    this.router.patch('/tasks/:id/status', async (req, res) => {
      try {
        const response = await this.updateTaskStatus.execute(
          req.params.id,
          req.body.status
        );
        res.json(response);
      } catch (err) {
        res.status(400).json({ error: err.message });
      }
    });

    this.router.get('/tasks', async (req, res) => {
      try {
        const status = req.query.status || 'TODO';
        const response = await this.getTasksByStatus.execute(status);
        res.json(response);
      } catch (err) {
        res.status(400).json({ error: err.message });
      }
    });

    this.router.delete('/tasks/:id', async (req, res) => {
      try {
        await this.deleteTask.execute(req.params.id);
        res.status(204).send();
      } catch (err) {
        res.status(400).json({ error: err.message });
      }
    });
  }

  getRouter() {
    return this.router;
  }
}

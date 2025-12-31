import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { TaskRepositoryImpl } from './insfrastructure/reporitories/TaskRepositoryImpl.js';
import { TaskController } from './presentation/controllers/TaskController.js';

const app = express();
app.use(bodyParser.json());
app.use(cors());

const taskRepository = new TaskRepositoryImpl();
const taskController = new TaskController(taskRepository);

app.use(taskController.getRouter());

app.listen(3000, () => {
  console.log('Backend running on http://localhost:3000');
});

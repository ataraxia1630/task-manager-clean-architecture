import { Task } from '../../domain/entities/Task.js';
import { ITaskRepository } from '../../application/ports/ITaskRepository.js';
import { prisma } from '../persistence/prisma-client.js';

export class TaskRepositoryImpl extends ITaskRepository {
  async save(task) {
    const data = {
      id: task.id.value,
      title: task.title,
      description: task.description,
      status: task.status.value,
      createdAt: task.createdAt,
    };
    await prisma.task.upsert({
      where: { id: task.id.value },
      update: data,
      create: data,
    });
  }

  async findById(id) {
    const prismaTask = await prisma.task.findUnique({
      where: { id: id.value },
    });
    if (!prismaTask) return null;
    return new Task(
      prismaTask.id,
      prismaTask.title,
      prismaTask.description,
      prismaTask.status,
      prismaTask.createdAt
    );
  }

  async findByStatus(status) {
    const prismaTasks = await prisma.task.findMany({
      where: { status: status.value },
    });
    return prismaTasks.map(
      (t) => new Task(t.id, t.title, t.description, t.status, t.createdAt)
    );
  }

  async delete(id) {
    await prisma.task.delete({ where: { id: id.value } });
  }
}

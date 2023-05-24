import { Task, TaskType } from '../entities/task.entity';
import { TaskRepository } from '../repositories/task.repository';

/**Base class for running tasks */
export class TaskService {
  constructor(protected readonly taskRepository: TaskRepository) {}

  /**Returns unfinished tasks from database*/
  protected async getUnfinishedTasks(type: TaskType) {
    return this.taskRepository.getUnfinishedTasks(type);
  }

  /**Runs a task with saving it to db on start and deleting when operation is finished*/
  protected async runTask(
    type: TaskType,
    name: string,
    existingTask: Task | undefined,
    callback: () => Promise<void>,
  ) {
    let taskId = existingTask?.id ?? null;

    if (!existingTask) {
      const { id } = await this.getOrSaveTask(type, name);
      taskId = id;
    }

    await callback();

    await this.taskRepository.deleteTaskById(taskId);
  }

  /**Get task from database. If not exists, saves it */
  private async getOrSaveTask(
    type: TaskType,
    name: string,
  ): Promise<{ id: number }> {
    const existingTask = await this.taskRepository.getTaskByName(name);
    if (existingTask) {
      return { id: existingTask.id };
    }

    const task = this.taskRepository.create({
      task_date: new Date(),
      task_type: type,
      task_name: name,
    });

    const id = await this.taskRepository.saveTaskAndReturnId(task);

    return { id };
  }
}

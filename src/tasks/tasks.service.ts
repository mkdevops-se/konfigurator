import {
  BadRequestException,
  HttpService,
  Injectable,
  Logger,
} from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { DeploymentsService } from '../deployments/deployments.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskRepository } from './entities/task.repository';
import { Action, State, Task } from './entities/task.entity';
import { BuildsService } from '../builds/builds.service';
import { MockBuildInfoDto } from '../mock-build-info/dto/mock-build-info.dto';
import { TaskInterface } from '../interfaces/task.interface';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  constructor(
    private tasksRepository: TaskRepository,
    private schedulerRegistry: SchedulerRegistry,
    private httpService: HttpService,
    private buildsService: BuildsService,
    private deploymentsService: DeploymentsService,
  ) {}

  private static getTimeoutName(taskId: number) {
    return `tasks-${taskId}`;
  }

  runInBackground(taskId: number) {
    const callback = async () => {
      this.schedulerRegistry.deleteTimeout(TasksService.getTimeoutName(taskId));
      const task = await this.tasksRepository.findEntity(taskId);
      this.logger.log(`Executing task ${JSON.stringify(task)}`);
      task.state = State.RUNNING;
      await this.tasksRepository.save(task);
      try {
        let result: any;
        if (task.action === Action.FETCH_BUILD_INFO) {
          result = await this.executeFetchBuildInfoTask(task);
        } else {
          throw new BadRequestException(`Unsupported action ${task.action}`);
        }
        task.data.result = result;
        task.state = State.SUCCESS;
        this.logger.debug(
          `Task ${JSON.stringify(task)} execution success: ${JSON.stringify(
            result,
          )}`,
        );
      } catch (err) {
        task.data.result = err.toString();
        task.state = State.FAILURE;
        this.logger.error(
          `Task ${JSON.stringify(task)} execution failure: ${err.toString()}`,
        );
      } finally {
        await this.tasksRepository.save(task);
      }
    };

    const timeout = setTimeout(callback, 500);
    this.schedulerRegistry.addTimeout(
      TasksService.getTimeoutName(taskId),
      timeout,
    );
  }

  async executeFetchBuildInfoTask(task: Task) {
    const deployment = await this.deploymentsService.getOne(
      task.data.target.environment,
      task.data.target.ocp_namespace,
      task.data.target.deployment,
    );
    const buildInfoUrl = `${task.data.target.external_url.replace(
      /\/$/,
      '',
    )}/bygginfo`;
    const buildInfoRes = await this.httpService
      .get(buildInfoUrl, {
        timeout: 5000,
      })
      .toPromise();
    const buildInfoData: MockBuildInfoDto = buildInfoRes.data;
    this.logger.debug(`Build info received: ${JSON.stringify(buildInfoData)}`);

    const [build, created] = await this.buildsService.getOrCreate(
      task.data.target.deployment,
      MockBuildInfoDto.toCreateBuildDto(buildInfoData),
    );

    if (deployment.image_tag !== build.image_tag) {
      await this.deploymentsService.update(
        deployment.environment,
        deployment.ocp_namespace,
        deployment.name,
        {
          ...build,
        },
      );
      return `Deployment ${deployment.name} in ${
        deployment.environment
      } now running ${
        created ? 'newly discovered' : 'known'
      } build with image_tag=${build.image_tag}`;
    } else {
      return `Nothing to do, image_tag=${deployment.image_tag} already up-to-date for ${deployment.name} in ${deployment.environment}`;
    }
  }

  async create(createTaskDto: CreateTaskDto) {
    const newTask = await this.tasksRepository.insertEntity(createTaskDto);
    this.logger.log(`Submitting task ${newTask.id} to ad-hoc scheduler ...`);
    this.runInBackground(newTask.id);
    return newTask;
  }

  async getAll() {
    const tasks: TaskInterface[] = await this.tasksRepository.find();
    for (const task of tasks) {
      if (task.updated_at) {
        task.update_timestamp = task.updated_at
          .toISOString()
          .replace(/.000Z$/, 'Z');
      }
      if (task.updated_at) {
        task.create_timestamp = task.created_at
          .toISOString()
          .replace(/.000Z$/, 'Z');
      }
      if (task.data.target) {
        task.data_target = JSON.stringify(task.data.target);
      }
      if (task.data.result) {
        task.data_result = task.data.result;
      }
    }
    return tasks;
  }

  getOne(id: number) {
    return this.tasksRepository.findEntity(id);
  }

  update(id: number, updateTaskDto: UpdateTaskDto) {
    return this.tasksRepository.updateEntity(id, updateTaskDto);
  }

  delete(id: number) {
    return this.tasksRepository.removeEntity(id);
  }
}

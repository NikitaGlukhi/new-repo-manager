import { HttpModule, Module } from '@nestjs/common';
import { RepositoriesData } from './controller/repositories-data';
import { UpdateRepositoriesService } from './services/update-repositories.service';
import { CronService } from './services/cron.service';
import { databaseProviders } from '../../database/database.providers';
import { gitHubRepositoriesProviders } from './repositories.providers';
import { LayerService } from './services/layer.service';

@Module({
  controllers: [
    RepositoriesData
  ],
  imports: [
    HttpModule,
  ],
  providers: [
    UpdateRepositoriesService,
    LayerService,
    CronService,
    ...databaseProviders,
    ...gitHubRepositoriesProviders,
  ]
})

export class GithubRepositoriesModule {  }

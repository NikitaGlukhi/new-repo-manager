import { HttpService, Injectable } from '@nestjs/common';
import { assign, pick, keys } from 'lodash';
import { LayerService } from './layer.service';
import { GithubRepositoryInterface } from '../../../interfaces/github-repository.interface';

const config = require('../../../config.json');

@Injectable()

export class UpdateRepositoriesService {

  constructor(
    private readonly httpService: HttpService,
    private readonly repositoryLayer: LayerService
  ) {  }

  private getTypeOfPrivacyAndReposNames(repositories: Object[]): Object[] {
    return Array.from(repositories, repository =>
      assign(
      {},
      {
        repoName: repository['full_name'],
        repoType: repository['private'] ? 'Private' : 'Public'
      })
    );
  }

  public async getOrgRepositories() {
    let repos = [];

    const url = `https://api.github.com/orgs/valor-software/repos?per_page=150`;
    const headOptions = {
      headers: {
        authorization: `token ${process.env.ACCESS_TOKEN}`
      }
    };

    await this.httpService.get(url, headOptions)
      .toPromise()
      .then(repositories => {
        repos = this.getTypeOfPrivacyAndReposNames(repositories.data);
      });
    await this.getRepositoryPackageJson(repos);
  }

  private async getRepositoryPackageJson(repositories) {
    for (let repository of repositories) {
      const master = await this.getDataFromGithub(repository.repoName, 'master');
      const development = await this.getDataFromGithub(repository.repoName, 'development');

      const newRepository: GithubRepositoryInterface = assign(repository, {
        organization: 'valor-software',
        dataSource: 'github',
        timestamp: Date.now(),
        branches: { master, development }
      });

      await this.repositoryLayer.updateRepositoryData(newRepository);
    }
    console.log('GitHub data updated');
  }

  private async getDataFromGithub(repositoryName: string, branchAlias: string) {
    let result = {};
    const headsOptions = {
      headers: {
        authorization: `token ${process.env.ACCESS_TOKEN}`
      }
    };

    for (let branchName of config.ALIASES_OF_BRANCH[branchAlias]) {
      const url = `https://raw.githubusercontent.com/${repositoryName}/${branchName}/package.json`;
       await this.httpService.get(url, headsOptions)
        .toPromise()
        .then((res: any) => {
          const data = assign(res.data, res.data.dependencies, res.data.devDependencies);

          result = pick(data, config.PACKAGES);
        })
        .catch(err => {});
    }

    if (keys(result).length === 0) {
      return undefined;
    }

    return result;
  }
}

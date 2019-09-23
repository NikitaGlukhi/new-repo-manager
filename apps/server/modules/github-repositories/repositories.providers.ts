import { Connection } from 'mongoose';
import { OrganizationsListSchema } from '../../db-schemas/organizations-list.schema';
import { GithubRepositoriesSchema } from '../../db-schemas/github-repository.schema';

export const gitHubRepositoriesProviders = [
  {
    provide: 'OrganizationsModelToken',
    useFactory: (connection: Connection) =>
      connection.model('organizations_list', OrganizationsListSchema),
    inject: ['DbConnectionToken']
  },
  {
    provide: 'NewRepositoryModelToken',
    useFactory: (connection: Connection) =>
      connection.model('repositories_data', GithubRepositoriesSchema),
    inject: ['DbConnectionToken']
  }
];

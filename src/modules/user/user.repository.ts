import { inject as Inject, injectable as Injectable } from 'inversify';
import { DataSource, Repository } from 'typeorm';
import TOKEN from '../../core/container/types.container';
import { User } from './user.entity';
import BaseRepository from '../../core/shared/repository';

@Injectable()
export class UserRepository extends Repository<User> implements BaseRepository<User> {
  constructor(@Inject(TOKEN.DataSource.Postgres) appDataSource: DataSource) {
    super(User, appDataSource.createEntityManager());
  }

  async findOneWhere(column: string, value: string | number, operator = '='): Promise<User | null> {
    return await this.createQueryBuilder('user')
      .where(`user.${column} ${operator} :value`, { value })
      .getOne();
  }
}

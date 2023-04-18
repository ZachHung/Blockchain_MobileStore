import { injectable as Injectable } from 'inversify';
import { Repository } from 'typeorm';
import { PostgresDataSource } from '../../config/data-source';
import { Event } from './event.entity';

@Injectable()
export class EventRepository extends Repository<Event> {
  constructor() {
    super(Event, PostgresDataSource.createEntityManager());
  }
}

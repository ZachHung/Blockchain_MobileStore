import { Event } from './event.entity';
import { CreateEventInput } from './event.input';
import { injectable as Injectable, inject as Inject } from 'inversify';
import TOKEN from '../../core/container/types.container';
import { EventRepository } from './event.repository';

@Injectable()
export class EventService {
  constructor(
    @Inject(TOKEN.Repositories.Event) private readonly eventRepository: EventRepository,
  ) {}

  async findById(id: string): Promise<Event | null> {
    try {
      const event = await this.eventRepository.findOne({
        where: { id },
        relations: { editBy: true },
      });
      return event;
    } catch (error) {
      return null;
    }
  }

  async create(input: CreateEventInput): Promise<Event> {
    const event = this.eventRepository.create(input);
    await this.eventRepository.save(event);
    return event;
  }
}

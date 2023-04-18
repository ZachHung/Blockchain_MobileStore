import { Arg, Mutation, Query, Resolver } from 'type-graphql';
import { Event } from './event.entity';
import { CreateEventInput } from './event.input';
import { inject as Inject, injectable as Injectable } from 'inversify';
import TOKEN from '../../core/container/types.container';
import { EventService } from './event.service';

@Injectable()
@Resolver()
export class EventResolver {
  constructor(@Inject(TOKEN.Services.Event) private readonly eventService: EventService) {}
  @Query(() => Event, { nullable: true })
  async findOneEvent(@Arg('eventId') eventId: string): Promise<Event | null> {
    const response = await this.eventService.findById(eventId);
    return response;
  }

  @Mutation(() => Event)
  async createEvent(@Arg('input') input: CreateEventInput): Promise<Event> {
    const response = await this.eventService.create({ ...input });
    return response;
  }
}

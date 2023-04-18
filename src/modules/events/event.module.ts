import { ContainerModule } from 'inversify';
import TOKEN from '../../core/container/types.container';
import { EventRepository } from './event.repository';
import { EventResolver } from './event.resolver';
import { EventService } from './event.service';

export class EventModule extends ContainerModule {
  constructor() {
    super((bind) => {
      bind<EventService>(TOKEN.Services.Event).to(EventService);
      bind<EventResolver>(EventResolver).toSelf();
      bind<EventRepository>(TOKEN.Repositories.Event).to(EventRepository);
    });
  }
}

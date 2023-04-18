import { Container, ContainerModule } from 'inversify';
import { Constructor } from '../../core/types/contructor.type';

export const createTestingModule = (...modules: Constructor<ContainerModule>[]): Container => {
  const container = new Container({ skipBaseClassChecks: true });
  container.load(...modules.map((module) => new module()));
  return container;
};

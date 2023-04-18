import { DataType, newDb } from 'pg-mem';
import { DataSource } from 'typeorm';
import { v4 } from 'uuid';

export const setupConnection = async (...entities: unknown[]): Promise<DataSource> => {
  const db = newDb({
    autoCreateForeignKeyIndices: true,
  });

  db.public.registerFunction({
    name: 'current_database',
    args: [],
    returns: DataType.text,
    implementation: (x) => `hello world: ${x}`,
  });

  db.public.registerFunction({
    name: 'version',
    args: [],
    returns: DataType.text,
    implementation: (x) => `hello world: ${x}`,
  });

  db.registerExtension('uuid-ossp', (schema) => {
    schema.registerFunction({
      name: 'uuid_generate_v4',
      returns: DataType.uuid,
      implementation: v4,
      impure: true,
    });
  });

  const dataSource: DataSource = await db.adapters.createTypeormDataSource({
    type: 'postgres',
    entities,
  });

  await dataSource.initialize();
  await dataSource.synchronize();
  return dataSource;
};

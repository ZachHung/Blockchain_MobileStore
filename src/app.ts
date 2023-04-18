import { ApolloServer } from 'apollo-server-express';
import * as dotenv from 'dotenv';
import { buildSchema } from 'type-graphql';
import { PostgresDataSource } from './config/data-source';
import logger from './config/logger';
import express, { Request } from 'express';
import {
  ApolloServerPluginLandingPageLocalDefault,
  ApolloServerPluginDrainHttpServer,
  ApolloServerPluginInlineTrace,
} from 'apollo-server-core';
import { getEnv } from './utils/get-env';
import { CustomAuthChecker } from './core/middlewares/auth-checker.middleware';
import { ErrorLoggerMiddleware } from './core/middlewares/error-logger.middleware';
import { User } from './modules/user/user.entity';
import http from 'http';
import { Context } from './core/types/context.interface';
import container from './core/container/config.container';

dotenv.config();

export const bootstrap = async (): Promise<void> => {
  try {
    const app = express();
    const httpServer = http.createServer(app);
    await PostgresDataSource.initialize();
    const schema = await buildSchema({
      resolvers: [__dirname + '/modules/**/*.resolver.{t,j}s'],
      globalMiddlewares: [ErrorLoggerMiddleware],
      authChecker: CustomAuthChecker,
      container,
    });

    const server = new ApolloServer({
      schema,
      csrfPrevention: true,
      cache: 'bounded',
      context: ({ req }): Context => {
        return {
          req: req,
          user: (req as Request & { user?: User }).user,
        };
      },
      plugins: [
        ApolloServerPluginInlineTrace(),
        ApolloServerPluginLandingPageLocalDefault({ embed: true }),
        ApolloServerPluginDrainHttpServer({ httpServer }),
      ],
    });
    await server.start();
    server.applyMiddleware({ app, cors: true });
    httpServer.listen(+getEnv('PORT'), () =>
      logger.info(
        `Server running in ${getEnv('NODE_ENV')} mode at http://localhost:${getEnv('PORT')}${
          server.graphqlPath
        }`,
      ),
    );
  } catch (error) {
    logger.error(error);
  }
};

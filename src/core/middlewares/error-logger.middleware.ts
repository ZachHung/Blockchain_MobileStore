import { MiddlewareFn, MiddlewareInterface, NextFn, ResolverData } from 'type-graphql';
import logger from '../../config/logger';
import { Context } from '../types/context.interface';
import { GraphQLError } from 'graphql';
import { ApolloError } from 'apollo-server-express';
import { injectable as Injectable } from 'inversify';

@Injectable()
export class ErrorLoggerMiddleware implements MiddlewareInterface<Context> {
  use: MiddlewareFn<Context> = async ({ context, info }: ResolverData<Context>, next: NextFn) => {
    try {
      return await next();
    } catch (err) {
      if (err instanceof GraphQLError || err instanceof ApolloError)
        logger.error(
          JSON.stringify({
            message: err.message,
            operation: info.operation.operation,
            fieldName: info.fieldName,
            user: context.user,
            stack: err.stack,
          }),
        );
      throw err;
    }
  };
}

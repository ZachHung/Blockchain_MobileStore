import { ApolloError } from 'apollo-server-core';

export const getEnv = (name: string): string => {
  const value = process.env[name];
  if (!value) {
    throw new ApolloError(`Missing: process.env['${name}'].`);
  }
  return value;
};

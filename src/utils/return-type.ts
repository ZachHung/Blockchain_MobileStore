import { DeleteResult, InsertResult, UpdateResult } from 'typeorm';

// Credit: https://stackoverflow.com/questions/47792808/typeorm-update-item-and-return-it
export const mutationReturn = async <T>(
  mutation: Promise<UpdateResult | DeleteResult | InsertResult>,
): Promise<T> => {
  return (await mutation).raw[0];
};

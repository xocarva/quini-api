/* eslint-disable @typescript-eslint/naming-convention */
import { ObjectId } from 'mongodb';
import { usersCollection } from './usersCollection';
import { PartialUserWithId, UserWithId } from '../../../schemas';

export async  function getUser(params: PartialUserWithId): Promise<UserWithId | null> {
  const { id, ...paramsData } = params;

  if (id && !ObjectId.isValid(id)) {
    return null;
  }

  const result = await usersCollection.findOne(
    id ? { _id: new ObjectId(id), ...paramsData } : params,
  );

  if (result) {
    const { _id, ...userData } = result;
    return { id: _id.toString(), ...userData };
  }

  return null;
}

/* eslint-disable @typescript-eslint/naming-convention */
import { ObjectId } from 'mongodb';
import { betsCollection } from './betsCollection';
import { DatabaseError, UnprocessableContentError } from '../../../../../errors';
import { BetWithId, PartialBet } from '../../../schemas';

export async function updateBet(id: string, betData: PartialBet): Promise<BetWithId> {
  if (!ObjectId.isValid(id)) {
    throw new UnprocessableContentError(`Invalid ID: ${id}`);
  }

  const updateQuery: Record<string, any> = { ...betData };

  if (betData.predictions) {
    betData.predictions.forEach(prediction => {
      const field = `predictions.${prediction.position - 1}.result`;
      updateQuery[field] = prediction.result;
    });

    delete updateQuery.predictions;
  }

  const result = await betsCollection.findOneAndUpdate(
    { _id: new ObjectId(id) },
    { $set: updateQuery },
    { returnDocument: 'after' },
  );

  if (!result.value) {
    throw new DatabaseError('Error updating bet');
  }

  const { _id, ...rest } = result.value;

  return { id: _id.toString(), ...rest } as BetWithId;
}

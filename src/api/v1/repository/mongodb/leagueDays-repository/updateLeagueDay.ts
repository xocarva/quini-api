/* eslint-disable @typescript-eslint/naming-convention */
import { ObjectId } from 'mongodb';
import { leagueDaysCollection } from './leagueDaysCollection';
import { DatabaseError, UnprocessableContentError } from '../../../../../errors';
import { LeagueDayWithId, PartialLeagueDay } from '../../../schemas';

// Type Guard
type Row = {
  position: number;
  homeTeamId: string;
  awayTeamId: string;
  result?: '0' | '1' | '2' | 'm' | 'x';
};

function isRowKey(key: any): key is keyof Row {
  return typeof key === 'string' && ['position', 'homeTeamId', 'awayTeamId', 'result'].includes(key);
}

export async function updateLeagueDay(id: string, leagueDayData: PartialLeagueDay): Promise<LeagueDayWithId> {
  
  type UpdatableLeagueDayProperties = {
    [key: string]: any;
  } & PartialLeagueDay;

  const updateQuery: any = {};

  for (const key in leagueDayData) {
    if (key !== 'rowsData') {
      updateQuery[key] = (leagueDayData as UpdatableLeagueDayProperties)[key];
    }
  }

  if (leagueDayData.rowsData) {
    for (const row of leagueDayData.rowsData) {
      if (row.homeTeamId) {
        if (!ObjectId.isValid(row.homeTeamId)) {
          throw new UnprocessableContentError(`Invalid homeTeamId: ${row.homeTeamId}`);
        }
        updateQuery['rowsData.$[element].homeTeamId'] = new ObjectId(row.homeTeamId);
      }

      if (row.awayTeamId) {
        if (!ObjectId.isValid(row.awayTeamId)) {
          throw new UnprocessableContentError(`Invalid awayTeamId: ${row.awayTeamId}`);
        }
        updateQuery['rowsData.$[element].awayTeamId'] = new ObjectId(row.awayTeamId);
      }

      // Use type guard here
      for (const key in row) {
        if (isRowKey(key) && key !== 'position' && key !== 'homeTeamId' && key !== 'awayTeamId') {
          updateQuery[`rowsData.$[element].${key}`] = row[key];
        }
      }
    }
  }

  const result = await leagueDaysCollection.findOneAndUpdate(
    { _id: new ObjectId(id) },
    { $set: updateQuery },
    {
      arrayFilters: leagueDayData.rowsData
        ? [{ 'element.position': { $in: leagueDayData.rowsData.map(r => r.position) } }]
        : [],
    },
  );

  if (!result.value) {
    throw new DatabaseError('Error updating league day');
  }

  const { _id, ...rest } = result.value;

  return { id: result.value._id.toString(), ...rest };
}

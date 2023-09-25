import { getLeagueDay, updateLeagueDay } from '../../repository';
import {
  ConflictError,
  DatabaseError,
  NotFoundError,
  UnprocessableContentError,
} from '../../../../errors';
import { LeagueDayWithId, PartialLeagueDay, partialLeagueDaySchema } from '../../schemas';

export async function updateOne(id: string, leagueDayData: PartialLeagueDay): Promise<LeagueDayWithId> {
  let leagueDay: LeagueDayWithId | null;

  try {
    leagueDay = await getLeagueDay({ id });
  } catch (error) {
    throw new DatabaseError(`Error checking if league day with id ${id} exists`);
  }

  if (!leagueDay) {
    throw new NotFoundError(`League day with id ${id} not found`);
  }

  const updatedData = partialLeagueDaySchema.parse(leagueDayData);
  const { leagueDayNumber } = updatedData;

  if (leagueDayNumber) {
    let existingTeamWithThisLeagueDayNumber: LeagueDayWithId | null;
    try {
      existingTeamWithThisLeagueDayNumber = await getLeagueDay({ leagueDayNumber });
      
    } catch (error) {
      throw new DatabaseError(
        `Error checkng if league day with number ${leagueDayNumber} exists`,
      );
    }

    if (existingTeamWithThisLeagueDayNumber
          && existingTeamWithThisLeagueDayNumber.season === leagueDay.season
          && existingTeamWithThisLeagueDayNumber.id !== id
    ) {
      throw new ConflictError(
        `League day number ${leagueDayNumber} for season ${leagueDay.season} already exists`,
      );
    }
  }

  try {
    const updated = await updateLeagueDay(id, updatedData);
    return updated;

  } catch (error) {
    if (error instanceof UnprocessableContentError) {
      throw new UnprocessableContentError(error.message);
    }

    throw new DatabaseError('Error updating league day');
  }
}

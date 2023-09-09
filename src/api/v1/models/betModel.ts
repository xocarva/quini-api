import z from 'zod';

export const betSchema = z.object({
  leagueDayId: z.string(),
  userId: z.string(),
  predictions: z.array(
    z.object({
      position: z.number().min(1).max(16),
      result: z.enum(['0', '1', '2', 'm', 'x']),
    }),
  ),
});

const partialBetSchema = betSchema.partial();
const betWithIdSchema = betSchema.extend({ id: z.string() });
const PartialBetWithId = betWithIdSchema.partial();

export type Bet = z.infer<typeof betSchema>;
export type PartialBet = z.infer<typeof partialBetSchema>;
export type BetWithId = z.infer<typeof betWithIdSchema>;
export type PartialBetWithId = z.infer<typeof PartialBetWithId>;

export class BetModel {
  static async findAll(params: PartialBetWithId): Promise<BetWithId[]> {
    return findAllBets(params);
  }

  static async findOne(params: PartialBetWithId): Promise<BetWithId | null> {
    return findOneBet(params);
  }

  static async createOne(bet: Bet): Promise<BetWithId> {
    return createOneBet(bet);
  }

  static async updateOne(id: string, betData: PartialBet): Promise<number> {
    return updateOneBet(id, betData);
  }

  static async deleteOne(id: string): Promise<number> {
    return deleteOneBet(id);
  }

  static validateOne(bet: any): Bet {
    return betSchema.parse(bet);
  }
  
  static validateOnePartial(bet: any): PartialBet {
    return partialBetSchema.parse(bet);
  }
  
  static validateOneWithId(bet: any): BetWithId {
    return betWithIdSchema.parse(bet);
  }
  
  static validateOnePartialWithId(bet: any): PartialBetWithId {
    return PartialBetWithId.parse(bet);
  }
}

//TODO bet repository
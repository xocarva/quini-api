function buildLookupStage(field: string, alias: string) {
  return {
    $lookup: {
      from: 'teams',
      localField: `rowsData.${field}`,
      foreignField: '_id',
      as: alias,
    },
  };
}

function buildTeamMappingStage(field: string, alias: string) {
  return {
    id: { $toString: `$$row.${field}` },
    name: {
      $arrayElemAt: [
        {
          $map: {
            input: {
              $filter: {
                input: `$${alias}`,
                as: 'team',
                cond: { $eq: ['$$team._id', `$$row.${field}`] },
              },
            },
            as: 'filteredTeam',
            in: '$$filteredTeam.name',
          },
        },
        0,
      ],
    },
  };
}

export function buildCompleteLeagueDayAggregation(query: any) {
  return [
    { $match: query },
    buildLookupStage('homeTeamId', 'homeTeams'),
    buildLookupStage('awayTeamId', 'awayTeams'),
    {
      $addFields: {
        rowsData: {
          $map: {
            input: '$rowsData',
            as: 'row',
            in: {
              position: '$$row.position',
              homeTeam: buildTeamMappingStage('homeTeamId', 'homeTeams'),
              awayTeam: buildTeamMappingStage('awayTeamId', 'awayTeams'),
            },
          },
        },
      },
    },
    {
      $project: {
        homeTeams: 0,
        awayTeams: 0,
      },
    },
  ];
}

import { InputTypeComposer } from 'graphql-compose';
import { getTypeName, CommonOpts, desc } from '../../../utils';
import { getGeoPointAsFieldConfigMap } from '../../Commons/FieldNames';
import { getGeoPointFC, getDistanceCalculationModeFC } from '../../Commons/Geo';

export function getGeoDistanceITC<TContext>(
  opts: CommonOpts<TContext>
): InputTypeComposer<TContext> | { type: string; description: string } {
  const name = getTypeName('QueryGeoDistance', opts);
  const description = desc(
    `
    Filters documents that include only hits that exists within
    a specific distance from a geo point.
    Requires the geo_point Mapping.
    [Documentation](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-geo-distance-query.html)
  `
  );

  const subName = getTypeName('QueryGeoDistanceSettings', opts);
  const fields = getGeoPointAsFieldConfigMap(
    opts,
    opts.getOrCreateITC(subName, () => ({
      name: subName,
      fields: {
        lat: getGeoPointFC(opts),
        lon: getGeoPointFC(opts),
      },
    }))
  );

  if (typeof fields === 'object') {
    return opts.getOrCreateITC(name, () => ({
      name,
      description,
      fields: {
        distance: {
          type: 'String!',
          description: 'Eg. 12km',
        },
        distance_type: getDistanceCalculationModeFC(opts),
        ...fields,
        validation_method: 'String',
      },
    }));
  }

  return {
    type: 'JSON',
    description,
  };
}

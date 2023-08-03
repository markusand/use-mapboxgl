import { Map, type MapboxOptions } from 'mapbox-gl';
import type { MapEventHandlers } from './events/events.map';
import { useMapEvents } from './events';
import useControls, {
  type ControlName,
  type ControlOptions,
  type TerrainControlOptions,
  type StylesControlOptions,
} from './controls';
import { capitalize } from './utils';

type Controls = Record<ControlName, ControlOptions | TerrainControlOptions | StylesControlOptions>;

export type MapOptions = {
  controls?: Partial<Controls>;
} & Omit<MapboxOptions, 'container'>
& Partial<MapEventHandlers>;


export default async (container: string | HTMLElement, options: MapOptions) => {
  const { controls, ...rest } = options;

  const map = new Map({ container, ...rest });
  await map.once('load');
  useMapEvents(map, rest);

  if (controls) {
    const controlAdders = useControls(map);
    Object.entries(controls).forEach(([name, params]) => {
      const adder = `add${capitalize(name)}` as `add${Capitalize<ControlName>}`;
      controlAdders[adder]?.(params);
    });
  }

  return map;
};

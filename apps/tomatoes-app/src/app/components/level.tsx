//this file defineds the type and default game level values

export type Level = {
  fps: number;
  duration: number;
  spawnRate: number;
  itemAChance: number;
  itemBChance: number;
  itemAMultiplier: number;
  itemBMultiplier: number;
  regionMultiplierX: number;
  regionMultiplierY: number;
};

export const defaultLevel = JSON.parse(
  JSON.stringify({
    fps: 5,
    duration: 30,
    spawnRate: 0,
    itemAChance: 0.75,
    itemBChance: 0.85,
    itemAMultiplier: 1,
    itemBMultiplier: 1,
    regionMultiplierX: 0,
    regionMultiplierY: 0,
  } as Level)
);

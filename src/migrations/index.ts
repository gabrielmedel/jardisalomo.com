import * as migration_20260203_021428_initial from './20260203_021428_initial';

export const migrations = [
  {
    up: migration_20260203_021428_initial.up,
    down: migration_20260203_021428_initial.down,
    name: '20260203_021428_initial'
  },
];

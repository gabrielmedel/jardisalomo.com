import * as migration_20260203_021428_initial from './20260203_021428_initial';
import * as migration_20260204_111245_add_menu_globals from './20260204_111245_add_menu_globals';

export const migrations = [
  {
    up: migration_20260203_021428_initial.up,
    down: migration_20260203_021428_initial.down,
    name: '20260203_021428_initial',
  },
  {
    up: migration_20260204_111245_add_menu_globals.up,
    down: migration_20260204_111245_add_menu_globals.down,
    name: '20260204_111245_add_menu_globals'
  },
];

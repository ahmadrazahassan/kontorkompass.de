import * as migration_20261114_220245_initial from './20261114_220245_initial';
import * as migration_20261114_222635_category_icon_cloud from './20261114_222635_category_icon_cloud';
import * as migration_20261115_000000_lock_supabase_data_api from './20261115_000000_lock_supabase_data_api';

export const migrations = [
  {
    up: migration_20261114_220245_initial.up,
    down: migration_20261114_220245_initial.down,
    name: '20261114_220245_initial',
  },
  {
    up: migration_20261114_222635_category_icon_cloud.up,
    down: migration_20261114_222635_category_icon_cloud.down,
    name: '20261114_222635_category_icon_cloud',
  },
  {
    up: migration_20261115_000000_lock_supabase_data_api.up,
    down: migration_20261115_000000_lock_supabase_data_api.down,
    name: '20261115_000000_lock_supabase_data_api'
  },
];

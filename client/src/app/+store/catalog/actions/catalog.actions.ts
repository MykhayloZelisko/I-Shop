import { createActionGroup, props } from '@ngrx/store';
import { CatalogInterface } from '../../../shared/models/interfaces/catalog.interface';

export const CatalogActions = createActionGroup({
  source: 'Catalog',
  events: {
    OpenCatalog: props<{ catalog: CatalogInterface }>(),
  },
});

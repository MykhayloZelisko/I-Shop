import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { CreateCPropertyInterface } from '../../../shared/models/interfaces/create-c-property.interface';
import { CPropertyInterface } from '../../../shared/models/interfaces/c-property.interface';
import { CPropertiesGroupInterface } from '../../../shared/models/interfaces/c-properties-group.interface';

export const CPropertyActions = createActionGroup({
  source: 'CProperty/API',
  events: {
    AddCProperties: props<{
      group: CPropertiesGroupInterface;
      properties: CreateCPropertyInterface[];
    }>(),
    AddFilteredProperties: props<{ ids: string[] }>(),
    AddCPropertiesByGroupsIds: props<{ ids: string[] }>(),
    AddCPropertiesSuccess: props<{
      properties: CPropertyInterface[];
    }>(),
    AddCPropertiesFailure: emptyProps(),
    AddCPropertiesByGroupId: props<{ group: CPropertiesGroupInterface }>(),
    AddCPropertiesByGroupIdSuccess: props<{
      group: CPropertiesGroupInterface;
      properties: CPropertyInterface[];
    }>(),
    AddCPropertiesByGroupIdFailure: emptyProps(),
    UpdateCProperty: props<{ id: string; propertyName: string }>(),
    UpdateCPropertySuccess: props<{ property: CPropertyInterface }>(),
    UpdateCPropertyFailure: emptyProps(),
    DeleteCProperty: props<{ id: string }>(),
    DeleteCPropertySuccess: props<{ id: string }>(),
    DeleteCPropertyFailure: emptyProps(),
    DeleteCProperties: props<{ ids: string[] }>(),
  },
});

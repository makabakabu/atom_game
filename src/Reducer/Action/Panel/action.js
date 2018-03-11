import { OrderedMap, Map, List } from 'immutable';
import { arrayMove } from 'react-sortable-hoc';
import uuidv4 from 'uuid';

const actionPanel = (state = {}, action) => {
    switch (action.type) {
        case 'ACTION_MODAL_VISIBILITY':
            return state.updateIn(['actionSequence', action.viewMode, 'modalVisibility'], value => !value);

        case 'ACTION_CREATE_OK':
            state = state.updateIn(['actionSequence', action.viewMode, 'sequence'], sequence => sequence.concat(OrderedMap({ [uuidv4()]: state.getIn(['actionSequence', action.viewMode, 'temp']) })));
            state = state.setIn(['actionSequence', action.viewMode, 'temp'], Map({}));
            return state.setIn(['actionSequence', action.viewMode, 'modalVisibility'], false);

        case 'ACTION_CREATE_CANCEL':
            state = state.setIn(['actionSequence', action.viewMode, 'temp'], Map({}));
            return state.setIn(['actionSequence', action.viewMode, 'modalVisibility'], false);

        case 'ACTION_PANEL_VISIBILITY':
            return state.setIn(['actionSequence', action.actionKey, 'panelVisibility'], action.visibility);

        case 'DELETE_ACTION':
            return state.deleteIn(['actionSequence', action.actionId]);

        case 'RENAME_ACTION':
            return state.setIn(['actionSequence', action.actionId, 'name'], action.name);

        case 'ACTION_REORDER': {
            const actionList = arrayMove(List(state.get('actionSequence').keySeq()).toArray(), action.oldIndex, action.newIndex);
            return state.set('actionSequence', OrderedMap(actionList.map(key => [key, state.getIn(['actionSequence', key])])));
        }

        case 'FOCUS_ACTION':
            return state.set('focusedAction', action.actionId);

        default:
            return state;
    }
};

export default actionPanel;

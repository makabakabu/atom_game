import { Map, OrderedMap, List } from 'immutable';
import { arrayMove } from 'react-sortable-hoc';
import uuidv4 from 'uuid';

const figure = (state = {}, action) => {
    switch (action.type) {
        case 'ADD_FIGURE':
            return state.set(action.figureId, Map({
                name: action.name,
                setting: Map({
                    visibility: false,
                    width: 48,
                    height: 32,
                }),
                status: OrderedMap({}),
                animate: OrderedMap({}),
                visibility: false,
            }));

        case 'REALASSET_STORE_CLONE':
            return state.set(uuidv4(), action.figure);

        case 'FIGURE_VISIBILITY':
            state = state.setIn([action.figureId, 'visibility'], action.visibility);
            return state;

        case 'RENAME_FIGURE':
            return state.setIn([action.figureId, 'name'], action.name);

        case 'FIGURE_REORDER': {
            const figureIdList = arrayMove(List(state.keySeq()).toArray(), action.oldIndex, action.newIndex);
            return OrderedMap(figureIdList.map(key => [key, state.get(key)]));
        }

        default:
            return state;
    }
};

export default figure;

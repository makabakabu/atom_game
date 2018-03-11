import { OrderedMap, List, Map } from 'immutable';
import { arrayMove } from 'react-sortable-hoc';
import uuidv4 from 'uuid';

const animate = (state = {}, action) => {
    switch (action.type) {
        case 'ADD_ANIMATE':
            state = state.set(uuidv4(), Map({
                name: '动画',
                scale: 1,
                focusedFrame: List([]),
                progress: Map({
                    value: 0,
                    max: 1,
                    execute: false,
                    frameList: List([]),
                }),
                loopSequence: List([]), // 包含sequence，loopType, num
                frameSequence: OrderedMap({}), // 每个单元包含
            }));
            return state;

        case 'RENAME_ANIMATE':
            return state.setIn([action.animateId, 'name'], action.name);

        case 'ANIMATE_REORDER': {
            const animateIdList = arrayMove(List(state.keySeq()).toArray(), action.oldIndex, action.newIndex);
            return OrderedMap(animateIdList.map(key => [key, state.get(key)]));
        }

        default:
            return state;
    }
};

export default animate;

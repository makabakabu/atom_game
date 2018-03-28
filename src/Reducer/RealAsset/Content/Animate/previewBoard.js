import { OrderedMap, List, Map } from 'immutable';
import { arrayMove } from 'react-sortable-hoc';
import uuidv4 from 'uuid';

const previewBoard = ({ state, action }) => {
    const focusedAnimate = state.getIn(['content', 'animate', 'focusedAnimate']);
    switch (action.type) {
        case 'ANIMATE_ADD_SEQUENCE': {
            const statusId = List(state.getIn(['figuresGroup', action.figureId, 'status']).keySeq()).get(action.oldIndex);
            let animate = state.getIn(['figuresGroup', focusedAnimate.get('figureId'), 'animate', focusedAnimate.get('animateId')]);
            const newId = uuidv4();
            if (animate.get('focusedFrame').size === 0) {
                animate = animate.set('focusedFrame', List([newId]));
            }
            animate = animate.update('frameSequence', value => value.concat(OrderedMap({ [newId]: Map({ figureId: action.figureId, statusId, type: 'status', functionPanel: Map({
                position: Map({ x: 0, y: 0 }),
                angle: 0,
                time: 2,
                shrink: 1,
            }) }) })));
            return state.setIn(['figuresGroup', focusedAnimate.get('figureId'), 'animate', focusedAnimate.get('animateId')], animate);
        }

        case 'ANIMATE_BOARD_FUNCTIONPANEL_SETTING_OPERATION': {
            const animate = state.getIn(['figuresGroup', focusedAnimate.get('figureId'), 'animate', focusedAnimate.get('animateId')]);
            let functionPanel = animate.getIn(['frameSequence', action.frameId, 'functionPanel']);
            functionPanel = action.operationKind.length === 1 ? functionPanel.set(action.operationKind[0], action.value) : functionPanel.setIn([...action.operationKind], action.value);
            return state.setIn(['figuresGroup', focusedAnimate.get('figureId'), 'animate', focusedAnimate.get('animateId'), 'frameSequence', action.frameId, 'functionPanel'], functionPanel);
        }

        case 'ANIMATE_CONTENT_DRAG': {
            const animate = state.getIn(['figuresGroup', focusedAnimate.get('figureId'), 'animate', focusedAnimate.get('animateId')]);
            const focusedFrame = animate.getIn(['focusedFrame', 0]);
            let functionPanel = animate.getIn(['frameSequence', focusedFrame, 'functionPanel']);
            functionPanel = functionPanel.updateIn(['position', 'x'], value => value + action.deltaX);
            functionPanel = functionPanel.updateIn(['position', 'y'], value => value + action.deltaY);
            return state.setIn(['figuresGroup', focusedAnimate.get('figureId'), 'animate', focusedAnimate.get('animateId'), 'frameSequence', focusedFrame, 'functionPanel'], functionPanel);
        }

        case 'FRAME_SEQUENCE_DELETE': {
            state = state.updateIn(['figuresGroup', focusedAnimate.get('figureId'), 'animate', focusedAnimate.get('animateId'), 'focusedFrame'], (value) => {
                if (value === action.frameId) {
                    return '';
                }
                return value;
            });
            return state.deleteIn(['figuresGroup', focusedAnimate.get('figureId'), 'animate', focusedAnimate.get('animateId'), 'frameSequence', action.frameId]);
        }

        case 'FRAME_SEQUENCE_REORDER': {
            const sequenceList = arrayMove(List(state.getIn(['figuresGroup', focusedAnimate.get('figureId'), 'animate', focusedAnimate.get('animateId'), 'frameSequence']).keySeq()).toArray(), action.oldIndex, action.newIndex);
            return state.updateIn(['figuresGroup', focusedAnimate.get('figureId'), 'animate', focusedAnimate.get('animateId'), 'frameSequence'], sequence => OrderedMap(sequenceList.map(key => [key, sequence.get(key)])));
        }

        case 'ANIMATE_FOCUS_NO_FRAMEID':
            return state.setIn(['figuresGroup', focusedAnimate.get('figureId'), 'animate', focusedAnimate.get('animateId'), 'focusedFrame'], List([]));

        case 'FOCUS_FRAME':
            if (state.getIn(['figuresGroup', focusedAnimate.get('figureId'), 'animate', focusedAnimate.get('animateId'), 'focusedFrame']).size === 0 || (!state.getIn(['figuresGroup', focusedAnimate.get('figureId'), 'animate', focusedAnimate.get('animateId'), 'focusedFrame']).includes(action.framId) && !action.shift)) {
                state = state.setIn(['figuresGroup', focusedAnimate.get('figureId'), 'animate', focusedAnimate.get('animateId'), 'focusedFrame'], List([action.frameId]));
                if (!state.getIn(['figuresGroup', focusedAnimate.get('figureId'), 'animate', focusedAnimate.get('animateId'), 'progress', 'frameList']).includes(action.frameId)) {
                    state = state.setIn(['figuresGroup', focusedAnimate.get('figureId'), 'animate', focusedAnimate.get('animateId'), 'progress', 'frameList'], List([action.frameId]));
                }
                return state;
            } else if (state.getIn(['figuresGroup', focusedAnimate.get('figureId'), 'animate', focusedAnimate.get('animateId'), 'focusedFrame']) !== state.getIn(['figuresGroup', focusedAnimate.get('figureId'), 'animate', focusedAnimate.get('animateId'), 'focusedFrame', 0]) && action.shift) {
                const animate = state.getIn(['figuresGroup', focusedAnimate.get('figureId'), 'animate', focusedAnimate.get('animateId')]);
                const focusedFrameId = animate.getIn(['focusedFrame', 0]);
                const frameList = List(animate.get('frameSequence').keySeq());
                const index1 = frameList.indexOf(focusedFrameId);
                const index2 = frameList.indexOf(action.frameId);
                const startId = Math.min(index1, index2);
                const endId = Math.max(index1, index2);
                state = state.setIn(['figuresGroup', focusedAnimate.get('figureId'), 'animate', focusedAnimate.get('animateId'), 'focusedFrame'], frameList.slice(startId, endId).push(frameList.get(endId)));
                if (!frameList.slice(startId, endId).push(frameList.get(endId)).isSubset(state.getIn(['figuresGroup', focusedAnimate.get('figureId'), 'animate', focusedAnimate.get('animateId'), 'progress', 'frameList']))) {
                    state = state.setIn(['figuresGroup', focusedAnimate.get('figureId'), 'animate', focusedAnimate.get('animateId'), 'progress', 'frameList'], frameList.slice(startId, endId).push(frameList.get(endId)));
                }
                return state;
            }
            return state;

        default:
            return state;
    }
};

export default previewBoard;

import { Map, OrderedMap, List } from 'immutable';

const menu = (state, action) => {
    const focusedAnimate = state.getIn(['content', 'animate', 'focusedAnimate']);
    const frameId = state.getIn(['content', 'animate', 'frame', 'focusedFrame']);
    switch (action.type) {
        case 'ANIMATE_TIPS':
            return state.setIn(['content', 'animate', 'frame', 'focusedFrame'], action.frameId);

        case 'FRAME_EDIT': {
            state = state.setIn(['content', 'viewMode'], 'status');
            state = state.setIn(['content', 'animate', 'locked'], false);
            const figureInfo = state.getIn(['figuresGroup', focusedAnimate.get('figureId'), 'animate', focusedAnimate.get('animateId'), 'frameSequence', frameId]);
            return state.setIn(['content', 'status', 'focusedStatus'], Map({
                figureId: figureInfo.get('figureId'),
                statusId: figureInfo.get('statusId'),
            }));
        }

        case 'FRAME_DUPLICATE': {
            let frameSequence = state.getIn(['figuresGroup', focusedAnimate.get('figureId'), 'animate', focusedAnimate.get('animateId'), 'frameSequence']);
            let frameSequenceList = List(frameSequence.keySeq());
            const index = frameSequenceList.indexOf(frameId);
            frameSequence = frameSequence.set(action.newId, frameSequence.get(frameId));
            frameSequenceList = frameSequenceList.insert(index + 1, action.newId);
            return state.setIn(['figuresGroup', focusedAnimate.get('figureId'), 'animate', focusedAnimate.get('animateId'), 'frameSequence'], OrderedMap(frameSequenceList.map(key => [key, frameSequence.get(key)])));
        }

        case 'ANIMATE_LOOP_VISIBILITY':
            return state.setIn(['content', 'animate', 'frame', 'loop', 'visibility'], action.visibility);

        case 'ANIMATE_LOOP_OK': {
            const focusedFrame = state.getIn(['figuresGroup', focusedAnimate.get('figureId'), 'animate', focusedAnimate.get('animateId'), 'focusedFrame']);
            const loop = state.getIn(['content', 'animate', 'frame', 'loop']);
            state = state.setIn(['content', 'animate', 'frame', 'loop'], Map({
                visibility: false,
                loopType: 'circle',
                numType: 'infinite',
                num: 1,
            }));
            return state.updateIn(['figuresGroup', focusedAnimate.get('figureId'), 'animate', focusedAnimate.get('animateId'), 'loopSequence'], loopSequence => loopSequence.push(loop.set('sequence', focusedFrame)));
        }

        case 'LOOP_CHANGE_VALUE':
            return state.setIn(['content', 'animate', 'frame', 'loop', action.name], action.value);

        default:
            return state;
    }
};

export default menu;

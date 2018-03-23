import { Map } from 'immutable';

const animateBoard = ({ state, action }) => {
    const focusedAnimate = state.getIn(['content', 'animate', 'focusedAnimate']);
    switch (action.type) {
        case 'FOCUS_ANIMATE':
            // 如果没有locked则正常
            // locked为true则无变化
            return state.setIn(['content', 'animate', 'focusedAnimate'], Map({
                figureId: action.figureId,
                animateId: action.animateId,
            }));

        case 'ANIMATE_SCALE':
            return state.updateIn(['figuresGroup', focusedAnimate.get('figureId'), 'animate', focusedAnimate.get('animateId'), 'scale'], scale => ((scale + action.value) <= 0.3 ? 0.3 : (scale + action.value)));

        case 'ANIMATE_CHANGE_STATE':
            return state.updateIn(['content', 'animate', action.kind], value => !value);

        case 'ANIMATE_EXECUTE_CHANGE_STATE':
            return state.updateIn(['figuresGroup', focusedAnimate.get('figureId'), 'animate', focusedAnimate.get('animateId'), 'progress', 'execute'], execute => !execute);

        case 'ANIMATE_EXECUTE':
            return state.setIn(['figuresGroup', focusedAnimate.get('figureId'), 'animate', focusedAnimate.get('animateId'), 'progress', 'frameList'], action.frameList);

        case 'ANIMATE_CHANGE_EXECUTE_VALUE':
            if (action.value <= state.getIn(['figuresGroup', focusedAnimate.get('figureId'), 'animate', focusedAnimate.get('animateId'), 'progress', 'max']) && action.value >= 0) {
                return state.setIn(['figuresGroup', focusedAnimate.get('figureId'), 'animate', focusedAnimate.get('animateId'), 'progress', 'value'], action.value);
            }
            return state;

        default:
            return state;
    }
};

export default animateBoard;

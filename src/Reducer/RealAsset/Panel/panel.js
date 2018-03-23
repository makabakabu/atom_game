import status from './status';
import figure from './figure';
import menu from './menu';
import animate from './animate';

const panel = ({ state, action }) => {
    state = state.update('figuresGroup', value => figure({ state: value, action }));
    if (Object.prototype.hasOwnProperty.call(action, 'figureId') && !action.type.includes('VIRTUALASSET')) {
        state = state.updateIn(['figuresGroup', action.figureId, 'status'], value => status({ state: value, action }));
        state = state.updateIn(['figuresGroup', action.figureId, 'animate'], value => animate({ state: value, action }));
    }
    state = menu({ state, action });
    return state;
};

export default panel;

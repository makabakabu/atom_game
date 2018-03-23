import cursor from './cursor';
import region from './region';
import brush from './brush';
import shape from './shape';
import bucket from './bucket';
import eraser from './eraser';
import picker from './picker';
import macroReducer from './macro';

const paintTool = ({ state, action }) => {
    switch (action.type) {
        case 'VIRTUALASSET_PAINTTOOL_SELECT':
            if (action.viewMode === 'picker' && state.get('viewMode') !== 'picker') {
                state = state.setIn(['picker', 'preserveViewMode'], state.get('viewMode'));
            }
            return state.set('viewMode', action.viewMode);

        default:
            state = state.update('cursor', value => cursor(value, action));
            state = state.update('region', value => region(value, action));
            state = state.update('brush', value => brush(value, action));
            state = state.update('shape', value => shape(value, action));
            state = state.update('bucket', value => bucket(value, action));
            state = state.update('eraser', value => eraser(value, action));
            state = state.update('macro', value => macroReducer(value, action));
            return state.update('picker', value => picker(value, action));
    }
};

export default paintTool;

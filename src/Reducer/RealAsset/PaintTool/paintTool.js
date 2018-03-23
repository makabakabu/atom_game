import cursor from './cursor';
import region from './region';
import brush from './brush';
import shape from './shape';
import bucket from './bucket';
import eraser from './eraser';
import picker from './picker';
import macroReducer from './macro';

const paintTool = ({ state, action }) => {
    let paintToolOperation = state.get('paintTool');
    const focusedStatus = state.getIn(['content', 'status', 'focusedStatus']);
    if (focusedStatus.get('figureId') !== '') {
        paintToolOperation = state.getIn(['figuresGroup', focusedStatus.get('figureId'), 'status', focusedStatus.get('statusId'), 'paintTool']);
    }
    switch (action.type) {
        case 'PAINTTOOL_SELECT':
            if (action.viewMode === 'picker' && paintToolOperation.get('viewMode') !== 'picker') {
                paintToolOperation = paintToolOperation.setIn(['picker', 'preserveViewMode'], paintToolOperation.get('viewMode'));
            }
            paintToolOperation = paintToolOperation.set('viewMode', action.viewMode);
            break;

        default:
            paintToolOperation = paintToolOperation.update('cursor', value => cursor({ state: value, action }));
            paintToolOperation = paintToolOperation.update('region', value => region({ state: value, action }));
            paintToolOperation = paintToolOperation.update('brush', value => brush({ state: value, action }));
            paintToolOperation = paintToolOperation.update('shape', value => shape({ state: value, action }));
            paintToolOperation = paintToolOperation.update('bucket', value => bucket({ state: value, action }));
            paintToolOperation = paintToolOperation.update('eraser', value => eraser({ state: value, action }));
            paintToolOperation = paintToolOperation.update('macro', value => macroReducer({ state: value, action }));
            paintToolOperation = paintToolOperation.update('picker', value => picker({ state: value, action }));
            break;
    }
    if (focusedStatus.get('figureId') !== '') {
        return state.setIn(['figuresGroup', focusedStatus.get('figureId'), 'status', focusedStatus.get('statusId'), 'paintTool'], paintToolOperation);
    }
        return state.set('paintTool', paintToolOperation);
};

export default paintTool;

import { OrderedMap, Map, List } from 'immutable';
import { arrayMove } from 'react-sortable-hoc';

const statusContent = (state = {}, action) => {
    let status;
    if (Object.prototype.hasOwnProperty.call(action, 'statusId')) {
        status = state.getIn(['figuresGroup', action.figureId, 'status', action.statusId]);
    }
    switch (action.type) {
        case 'FIGURE_CHNAGE_VIEWMODE':
            return state.setIn(['content', 'viewMode'], action.viewMode);

        case 'FOCUS_STATUS':
            // 如果没有locked则正常
            // locked为true则无变化
            return state.setIn(['content', 'status', 'focusedStatus'], Map({
                statusId: action.statusId,
                figureId: action.figureId,
            }));

        case 'STATUS_ADD_SEQUENCE': {
            const statusId = List(state.getIn(['figuresGroup', action.figureId, 'status']).keySeq()).get(action.oldIndex);
            return state.updateIn(['content', 'status', 'sequence'], value => value.concat(OrderedMap({ [statusId]: action.figureId })));
        }

        case 'STATUS_SEQUENCE_DELETE':
            state = state.updateIn(['content', 'status', 'sequence'], value => value.delete(action.statusId));
            return state;

        case 'STATUS_SEQUENCE_REORDER': {
            const sequenceList = arrayMove(List(state.getIn(['content', 'status', 'sequence']).keySeq()).toArray(), action.oldIndex, action.newIndex);
            return state.updateIn(['content', 'status', 'sequence'], sequence => OrderedMap(sequenceList.map(key => [key, sequence.get(key)])));
        }

        case 'FIGURE_BOARD_BRUSH': {
            let value = state.getIn(['figuresGroup', action.figureId, 'status', action.statusId, 'value']);
            const rowLength = value.size;
            const colLength = value.get(0).size;
            switch (action.viewMode) {
                case 'brush': case 'eraser':
                    action.brushRegion.forEach((cell) => {
                        if (cell.get(0) < rowLength && cell.get(1) < colLength) {
                            value = value.setIn([cell.get(0), cell.get(1)], Map({ hex: action.hex, opacity: action.opacity }));
                        }
                    });
                    break;
                default:
                    break;
            }
            state = state.setIn(['figuresGroup', action.figureId, 'status', action.statusId, 'value'], value);
            return state.setIn(['figuresGroup', action.figureId, 'status', action.statusId, 'paintTool', action.viewMode, 'mouseDown'], action.mouseDown);
        }

        case 'FIGURE_BOARD_CURSOR_SELECT_END': {
            let value = status.get('value');
            value = value.map((rowList, rowIndex) => (
                rowList.map((cell, colIndex) => {
                    if (action.region.getIn([rowIndex, colIndex, 'inner'])) {
                        return action.region.getIn([rowIndex, colIndex]);
                    }
                    return cell;
                })
            ));
            return state.setIn(['figuresGroup', action.figureId, 'status', action.statusId, 'value'], value);
        }

        case 'FIGURE_BOARD_CURSOR_SELECT_MOUSEDOWN': {
            let value = status.get('value');
            value = value.map((rowList, rowIndex) => (
                rowList.map((cell, colIndex) => {
                    if (action.region.getIn([rowIndex, colIndex, 'inner'])) {
                        return Map({ hex: '#ededed', opacity: 1 });
                    }
                    return cell;
                })
            ));
            return state.setIn(['figuresGroup', action.figureId, 'status', action.statusId, 'value'], value);
        }

        default:
            return state;
    }
};

export default statusContent;

import { Map, List, OrderedMap } from 'immutable';
import uuidv4 from 'uuid';
import { arrayMove } from 'react-sortable-hoc';

const asset = ({ state, action }) => {
    const viewMode = state.get('viewMode');
    let focusedId = state.getIn(['figure', 'focusedFigureId']);
    if (viewMode === 'animate') {
        focusedId = state.getIn(['animate', 'focusedAnimateId']);
    }
    let focusedFigureId = '';
    if (focusedId !== '') {
        focusedFigureId = state.getIn([viewMode, 'sequence', focusedId, 'figure', 'focusedFigureId']);
    }
    switch (action.type) {
        case 'VIRTUALASSET_CHNAGE_VIEWMODE':
            return state.set('viewMode', action.viewMode);

        case 'VIRTUALASSET_SAVE_SCRIPTS':
            return state.setIn([viewMode, 'sequence', focusedId, 'scripts'], action.scripts);

        case 'VIRTUALASSET_FIGURE_VISIBILITY':
            return state.setIn([viewMode, 'sequence', viewMode === 'figure' ? action.figureId : action.animateId, 'visibility'], action.visibility);

        case 'VIRTUALASSET_ADD_ASSET':
            if (viewMode === 'figure') {
                return state.updateIn(['figure', 'sequence'], sequence => sequence.concat(OrderedMap({
                [uuidv4()]: Map({
                    name: '人物',
                    scripts: '',
                    visibility: false,
                    status: Map({
                        focusedStatusId: '',
                        sequence: OrderedMap({}),
                    }),
                    execute: false,
                }) })));
            }
            return state.updateIn(['animate', 'sequence'], sequence => sequence.concat(OrderedMap({
                [uuidv4()]: Map({
                    name: '动画',
                    scale: 1,
                    focusedFrame: List([]),
                    progress: Map({
                        value: 0,
                        max: 1,
                        execute: false,
                        frameList: List([]),
                    }),
                    loopSequence: List([]),
                    frameSequence: OrderedMap({}),
                    scripts: '',
                    visibility: false,
                    frame: Map({
                        focusedFrameId: '',
                        sequence: OrderedMap({}),
                    }),
                }) })));

        case 'VIRTUALASSET_FIGURE_ANIMATE_REORDER': {
            const idList = arrayMove(List(state.getIn([viewMode, 'sequence']).keySeq()).toArray(), action.oldIndex, action.newIndex);
            return state.updateIn([viewMode, 'sequence'], list => OrderedMap(idList.map(key => [key, list.get(key)])));
        }

        case 'VIRTUALASSET_ADD_STATUS':
            return state.updateIn(['figure', 'sequence', action.figureId, 'status', 'sequence'], sequence => sequence.concat(OrderedMap({
                [uuidv4()]: Map({
                    name: '状态',
                    value: List([...Array(32)].map(() => List(Array(48).fill(Map({ hex: '#ededed', opacity: 1 }))))),
                    paintTool: Map({
                        viewMode: 'cursor',
                        macro: Map({
                            hex: '#f04743',
                            region: List([...Array(32)].map(() => List(Array(48).fill(Map({ hex: '#ededed', opacity: 1, inner: false }))))), // row, col, hex, opacity
                            cursorRegion: List([]),
                        }),
                        cursor: Map({
                            arrangeViewMode: '',
                            mode: 'outline',
                            position: Map({
                                viewMode: 'size',
                                bracket: '',
                                width: 0,
                                height: 0,
                            }),
                            rotate: Map({
                                flip: '',
                                angle: 0,
                                operation: false,
                            }),
                            select: false,
                            pick: Map({
                                trigger: false,
                                row: '',
                                col: '',
                                hex: '',
                                opacity: '',
                            }),
                            region: List([]),
                        }),
                        region: Map({
                            viewMode: 'create',
                            start: Map({ row: 0, col: 0 }),
                            click: false,
                            mode: 'outline',
                        }),
                        brush: Map({
                            colorPicker: false,
                            pixelSize: 1,
                            opacity: 1,
                            mouseDown: false,
                            mouseRegion: List([]),
                        }),
                        shape: Map({
                            viewMode: 'rectangle',
                            click: false,
                            start: Map({ row: 0, col: 0 }),
                            rectangle: Map({
                                stroke: Map({
                                    thickness: 1,
                                    colorPicker: false,
                                    hex: '#F2453D',
                                    opacity: 1,
                                    selected: true,
                                }),
                                fill: Map({
                                    colorPicker: false,
                                    hex: '#F2453D',
                                    opacity: 1,
                                    selected: false,
                                }),
                            }),
                            elipse: Map({
                                stroke: Map({
                                    thickness: 1,
                                    colorPicker: false,
                                    hex: '#F2453D',
                                    opacity: 1,
                                    selected: true,
                                }),
                                fill: Map({
                                    colorPicker: false,
                                    hex: '#F2453D',
                                    opacity: 1,
                                    selected: true,
                                }),
                            }),
                            polygon: Map({
                                edges: 5,
                                operation: false,
                                stroke: Map({
                                    thickness: 1,
                                    hex: '#F2453D',
                                    colorPicker: false,
                                    opacity: 1,
                                    selected: true,
                                }),
                                fill: Map({
                                    hex: '#F2453D',
                                    colorPicker: false,
                                    opacity: 1,
                                    selected: true,
                                }),
                            }),
                        }),
                        bucket: Map({
                            mode: 'outline',
                            colorPicker: false,
                            opacity: 100,
                        }),
                        eraser: Map({
                            pixelSize: 1,
                        }),
                        picker: Map({
                            colorPicker: false,
                            preserveViewMode: 'brush',
                        }),
                    }),
                }) })));

        // case 'VIRTUALASSET_ADD_FRAME': {
        //     const statusId = List(state.getIn(['figuresGroup', action.figureId, 'status']).keySeq()).get(action.oldIndex);
        //     let animate = state.getIn(['figuresGroup', focusedAnimate.get('figureId'), 'animate', focusedAnimate.get('animateId')]);
        //     const newId = uuidv4();
        //     if (animate.get('focusedFrame').size === 0) {
        //         animate = animate.set('focusedFrame', List([newId]));
        //     }
        //     animate = animate.update('frameSequence', value => value.concat(OrderedMap({ [newId]: Map({ figureId: action.figureId, statusId, type: 'status', functionPanel: Map({
        //         position: Map({ x: 0, y: 0 }),
        //         angle: 0,
        //         time: 2,
        //         shrink: 1,
        //     }) }) })));
        //     return state.setIn(['figuresGroup', focusedAnimate.get('figureId'), 'animate', focusedAnimate.get('animateId')], animate);
        // }


        case 'VIRTUALASSET_FOCUS_ASSET':
            if (viewMode === 'figure') {
                state = state.setIn([viewMode, 'focusedFigureId'], action.figureId);
            }
            return state.setIn([viewMode, 'focusedAnimateId'], action.animateId);

        case 'VIRTUALASSET_RENAME_ASSET':
            return state.setIn([viewMode, 'sequence', viewMode === 'figure' ? action.figureId : action.animateId, 'name'], action.name);

        case 'VIRTUALASSET_RENAME_STATUS':
            return state.setIn([viewMode, 'sequence', viewMode === 'figure' ? action.figureId : action.animateId, 'status', 'sequence', action.statusId, 'name'], action.name);

        case 'VIRTUALASSET_REORDER_ASSET': {
            const figureIdList = arrayMove(List(state.getIn([viewMode, 'sequence']).keySeq()).toArray(), action.oldIndex, action.newIndex);
            return state.setIn([viewMode, 'sequence'], OrderedMap(figureIdList.map(key => [key, state.getIn([viewMode, 'sequence', key])])));
        }
        case 'VIRTUALASSET_SIMULATION_REORDER_FIGURE': {
            const figureIdList = arrayMove(List(state.getIn([viewMode, 'sequence', focusedId, 'figure', 'sequence']).keySeq()).toArray(), action.oldIndex, action.newIndex);
            return state.setIn([viewMode, 'sequence', focusedId, 'figure', 'sequence'], OrderedMap(figureIdList.map(key => [key, state.getIn([viewMode, 'sequence', focusedId, 'figure', 'sequence', key])])));
        }

        case 'VIRTUALASSET_SIMULATION_CHNAGE_VIEWMODE':
            return state.updateIn([viewMode, 'sequence', state.getIn([viewMode, 'focusedFigureId']), 'preview', 'execute'], value => !value);

        case 'VIRTUALASSET_ADD_SIMULATION_FIGURE':
            return state.updateIn([viewMode, 'sequence', focusedId, 'figure', 'sequence'], sequence => sequence.concat(OrderedMap({
                [uuidv4()]: Map({
                    name: '状态',
                    value: List([...Array(32)].map(() => List(Array(48).fill(Map({ hex: '#ededed', opacity: 1 }))))),
                    paintTool: Map({
                        viewMode: 'cursor',
                        macro: Map({
                            hex: '#f04743',
                            region: List([...Array(32)].map(() => List(Array(48).fill(Map({ hex: '#ededed', opacity: 1, inner: false }))))), // row, col, hex, opacity
                            cursorRegion: List([]),
                        }),
                        cursor: Map({
                            arrangeViewMode: '',
                            mode: 'outline',
                            position: Map({
                                viewMode: 'size',
                                bracket: '',
                                width: 0,
                                height: 0,
                            }),
                            rotate: Map({
                                flip: '',
                                angle: 0,
                                operation: false,
                            }),
                            select: false,
                            pick: Map({
                                trigger: false,
                                row: '',
                                col: '',
                                hex: '',
                                opacity: '',
                            }),
                            region: List([]),
                        }),
                        region: Map({
                            viewMode: 'create',
                            start: Map({ row: 0, col: 0 }),
                            click: false,
                            mode: 'outline',
                        }),
                        brush: Map({
                            colorPicker: false,
                            pixelSize: 1,
                            opacity: 1,
                            mouseDown: false,
                            mouseRegion: List([]),
                        }),
                        shape: Map({
                            viewMode: 'rectangle',
                            click: false,
                            start: Map({ row: 0, col: 0 }),
                            rectangle: Map({
                                stroke: Map({
                                    thickness: 1,
                                    colorPicker: false,
                                    hex: '#F2453D',
                                    opacity: 1,
                                    selected: true,
                                }),
                                fill: Map({
                                    colorPicker: false,
                                    hex: '#F2453D',
                                    opacity: 1,
                                    selected: false,
                                }),
                            }),
                            elipse: Map({
                                stroke: Map({
                                    thickness: 1,
                                    colorPicker: false,
                                    hex: '#F2453D',
                                    opacity: 1,
                                    selected: true,
                                }),
                                fill: Map({
                                    colorPicker: false,
                                    hex: '#F2453D',
                                    opacity: 1,
                                    selected: true,
                                }),
                            }),
                            polygon: Map({
                                edges: 5,
                                operation: false,
                                stroke: Map({
                                    thickness: 1,
                                    hex: '#F2453D',
                                    colorPicker: false,
                                    opacity: 1,
                                    selected: true,
                                }),
                                fill: Map({
                                    hex: '#F2453D',
                                    colorPicker: false,
                                    opacity: 1,
                                    selected: true,
                                }),
                            }),
                        }),
                        bucket: Map({
                            mode: 'outline',
                            colorPicker: false,
                            opacity: 100,
                        }),
                        eraser: Map({
                            pixelSize: 1,
                        }),
                        picker: Map({
                            colorPicker: false,
                            preserveViewMode: 'brush',
                        }),
                    }),
                }) })));

        case 'VIRTUALASSET_FOCUS_SIMULATION_FIGURE':
            return state.setIn([viewMode, 'sequence', focusedId, 'figure', 'focusedFigureId'], action.figureId);

        case 'VIRTUALASSET_SIMULATION_RENAME_FIGURE':
            return state.setIn([viewMode, 'sequence', focusedId, 'figure',
            'sequence', action.figureId, 'name'], action.name);

        case 'VIRTUALASSET_SIMULATION_DELETE_FIGURE':
            state = state.setIn([viewMode, 'sequence', focusedId, 'figure', 'focusedFigureId'], '');
            return state.deleteIn([viewMode, 'sequence', focusedId, 'figure', 'sequence', action.figureId]);

        case 'VIRTUALASSET_DELETE_ASSET':
            state = state.setIn([viewMode, viewMode === 'figure' ? 'focusedFigureId' : 'focusedAnimateId'], '');
            return state.deleteIn([viewMode, 'sequence', action.assetId]);

        case 'VIRTUALASSET_FINISH_EDIT':
            return state.setIn([viewMode, 'sequence', focusedId, 'figure', 'focusedFigureId'], '');

        case 'VIRTUALASSET_FIGURE_BOARD_BRUSH': {
            let value = state.getIn([viewMode, 'sequence', focusedId, 'figure', 'sequence', focusedFigureId, 'value']);
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
            state = state.setIn([viewMode, 'sequence', focusedId, 'figure', 'sequence', focusedFigureId, 'value'], value);
            return state.setIn([viewMode, 'sequence', focusedId, 'figure', 'sequence', focusedFigureId, 'paintTool', action.viewMode, 'mouseDown'], action.mouseDown);
        }

        case 'VIRTUALASSET_FIGURE_BOARD_CURSOR_SELECT_END': {
            let value = state.getIn([viewMode, 'sequence', focusedId, 'figure', 'sequence', focusedFigureId, 'value']);
            value = value.map((rowList, rowIndex) => (
                rowList.map((cell, colIndex) => {
                    if (action.region.getIn([rowIndex, colIndex, 'inner'])) {
                        return action.region.getIn([rowIndex, colIndex]);
                    }
                    return cell;
                })
            ));
            return state.setIn([viewMode, 'sequence', focusedId, 'figure', 'sequence', focusedFigureId, 'value'], value);
        }

        case 'VIRTUALASSET_FIGURE_BOARD_CURSOR_SELECT_MOUSEDOWN': {
            let value = state.getIn([viewMode, 'sequence', focusedId, 'figure', 'sequence', focusedFigureId, 'value']);
            value = value.map((rowList, rowIndex) => (
                rowList.map((cell, colIndex) => {
                    if (action.region.getIn([rowIndex, colIndex, 'inner'])) {
                        return Map({ hex: '#ededed', opacity: 1 });
                    }
                    return cell;
                })
            ));
            return state.setIn([viewMode, 'sequence', focusedId, 'figure', 'sequence', focusedFigureId, 'value'], value);
        }

        default:
            return state;
    }
};

export default asset;

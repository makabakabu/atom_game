import { Map, List, OrderedMap } from 'immutable';
import { arrayMove } from 'react-sortable-hoc';

const status = (state = {}, action) => {
    switch (action.type) {
        case 'ADD_STATUS':
            return state.set(action.statusId, Map({
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
            }));

        case 'RENAME_STATUS':
            return state.setIn([action.statusId, 'name'], action.name);

        case 'STATUS_REORDER': {
            const statusIdList = arrayMove(List(state.keySeq()).toArray(), action.oldIndex, action.newIndex);
            return OrderedMap(statusIdList.map(key => [key, state.get(key)]));
        }

        default:
            return state;
    }
};

export default status;

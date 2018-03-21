import { Map, OrderedMap, List } from 'immutable';

const initState = Map({
    realAsset: Map({
        figuresGroup: OrderedMap({}),
        contextMenu: Map({
            content: Map({
                figure: Map({
                    target: '',
                    figureId: '',
                    statusId: '',
                    paste: Map({
                        figureId: '',
                        statusId: '',
                        target: '',
                    }),
                }),
                animate: Map({
                    figureId: '',
                    animateId: '',
                    paste: Map({
                        figureId: '',
                        animateId: '',
                    }),
                }),
            }),
            viewMode: 'figure',
        }),
        content: Map({
            viewMode: 'status',
            status: Map({
                focusedStatus: Map({
                    figureId: '',
                    statusId: '',
                }),
                sequence: OrderedMap({}),
            }),
            animate: OrderedMap({
                locked: false,
                trace: true,
                focusedAnimate: Map({
                    figureId: '',
                    animateId: '',
                }),
                frame: Map({
                    focusedFrame: '',
                    loop: Map({
                        visibility: false,
                        loopType: 'circle',
                        num: 1,
                    }),
                }),
            }),
        }),
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
                cuvette: false,
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
    }),
    virtualAsset: Map({
        assetViewMode: 'virtualAsset',
        viewMode: 'figure',
        figure: Map({
            focusedFigureId: '',
            contextMenu: Map({}),
            sequence: OrderedMap({}),
        }),
        animate: Map({
            focusedAnimateId: '',
            contextMenu: Map({}),
            sequence: OrderedMap({}),
        }),
    }),
    action: Map({
        asset: Map({
            viewMode: 'realAsset',
        }),
        actionSequence: Map({
            crash: Map({
                modalVisibility: false,
                panelVisibility: false,
                sequence: OrderedMap({}),
                focusedActionId: '',
                temp: Map({
                    asset1: '',
                    asset2: '',
                    num: '',
                    name: '',
                }),
            }),
            click: Map({
                modalVisibility: false,
                panelVisibility: false,
                sequence: OrderedMap({}),
                temp: Map({
                    kind: '',
                    asset: '',
                    name: '',
                }),
            }),
            keyboard: Map({
                modalVisibility: false,
                panelVisibility: false,
                sequence: OrderedMap({}),
                temp: Map({
                    key: '',
                    kind: '',
                    name: '',
                }),
            }),
            time: Map({
                modalVisibility: false,
                panelVisibility: false,
                sequence: OrderedMap({}),
                temp: Map({
                    asset: '',
                    name: '',
                    start: '',
                    end: '',
                }),
            }),
            location: Map({
                modalvisibility: false,
                panelVisibility: false,
                sequence: OrderedMap({}),
                temp: Map({
                    asset1: '',
                    asset2: '',
                    start: '',
                    end: '',
                    name: '',
                }),
            }),
        }),
        viewMode: 'code',
    }),
    game: Map({
        execute: false,
    }),
    account: Map({
        signIn: Map({
            userName: '',
            password: '',
        }),
        register: Map({
            userName: '',
            password: '',
            rePassword: '',
        }),
        viewMode: 'signIn',
        visibility: false,
    }),
    store: Map({
        visibility: false,
        hover: false,
        viewMode: 'realAsset',
        realAsset: Map({
            focus: Map({}),
        }),
        virtualAsset: Map({}),
        action: Map({}),
        game: Map({}),
    }),
    viewMode: 'realAsset',
});

export default initState;

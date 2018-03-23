const shape = ({ state, action }) => {
    const viewMode = state.get('viewMode');
    switch (action.type) {
        case 'VIRTUALASSET_PAINTTOOL_SHAPE_SELECT_VIEWMODE':
            return state.set('viewMode', action.viewMode);

        case 'VIRTUALASSET_PAINTTOOL_SHAPE_POLYGON_ROTATE_CLICK':
            return state.setIn(['polygon', 'edges'], action.edges);

        case 'VIRTUALASSET_PAINTTOOL_SHAPE_POLYGON_ROTATE_OPERATION':
            return state.setIn(['polygon', 'operation'], action.operation);

        case 'VIRTUALASSET_PAINTTOOL_SHAPE_SLIDE':
            if (action.slideObject[1] === 'opacity') {
                action.value /= 100;
            }
            return state.setIn([viewMode, ...action.slideObject], action.value);

        case 'VIRTUALASSET_PIANTTOOL_SHAPE_SELECT_MOUSEDOWN':
            state = state.set('start', action.start);
            return state.set('click', action.click);

        case 'VIRTUALASSET_PAINTTOOL_SHAPE_CHECK':
            return state.setIn([viewMode, action.kind, 'selected'], action.isCheck);

        case 'VIRTUALASSET_PAINTTOOL_SHAPE_INPUT':
            return state.setIn([viewMode, action.kind], action.value);

        case 'VIRTUALASSET_PAINTTOOL_SHAPE_COLORPICKER_VISIBILITY':
            return state.setIn([viewMode, action.kind, 'colorPicker'], action.visibility);

        case 'VIRTUALASSET_PAINTTOOL_SHAPE_COLORPICKER_SELECT':
            return state.setIn([viewMode, action.kind, 'hex'], action.color.hex);

        default:
            return state;
    }
};

export default shape;

const brush = ({ state, action }) => {
    switch (action.type) {
        case 'PAINTTOOL_BRUSH':
            return state.set(action.kind, action.value);

        case 'PAINTTOOL_BRUSH_COLORPICKER_VISIBILITY':
            return state.update('colorPicker', value => !value);

        case 'PAINTTOOL_BRUSH_CUVETTE_VISIBILITY':
            return state.update('cuvette', value => !value);

        case 'PAINTTOOL_BRUSH_CUVETTE_PICK':
            return state.set('opacity', action.opacity);

        default:
            return state;
    }
};

export default brush;

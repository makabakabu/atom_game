const eraser = ({ state, action }) => {
    switch (action.type) {
        case 'VIRTUALASSET_PAINTTOOL_BRUSH_PIXEL_SIZE':
            return state.set('pixelSize', action.size);

        default:
            return state;
    }
};

export default eraser;

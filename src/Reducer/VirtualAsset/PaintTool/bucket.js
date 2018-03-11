const bucket = (state, action) => {
    switch (action.type) {
        case 'VIRTUALASSET_PAINTTOOL_BUCKET_OPACITY':
            return state.set('opacity', action.opacity / 100);

        case 'VIRTUALASSET_PAINTTOOL_BUCKET_COLORPICKER_VISIBILITY':
            return state.update('colorPicker', value => !value);

        case 'VIRTUALASSET_PAINTTOOL_BUCKET_COLORPICKER_SELECT':
            return state.set('hex', action.color.hex);

        case 'VIRTUALASSET_PAINTTOOL_REGION_MODE':
            return state.set('mode', action.mode);

        default:
            return state;
    }
};

export default bucket;

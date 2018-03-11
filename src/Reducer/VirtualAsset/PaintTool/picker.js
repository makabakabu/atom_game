const picker = (state, action) => {
    switch (action.type) {
        case 'VIRTUALASSET_PAINTTOOL_PICKER_VISIBILITY':
            return state.update('colorPicker', value => !value);

        case 'VIRTUALASSET_PAINTTOOL_COLOR_SELECT':
            return state.set('colorPicker', false);

        default:
            return state;
    }
};

export default picker;

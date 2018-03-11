const picker = (state, action) => {
    switch (action.type) {
        case 'PAINTTOOL_PICKER_VISIBILITY':
            return state.update('colorPicker', value => !value);

        case 'PAINTTOOL_COLOR_SELECT':
            return state.set('colorPicker', false);

        default:
            return state;
    }
};

export default picker;

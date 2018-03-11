const rotateEpic = action$ => (
    action$.ofType('PAINTTOOL_CURSOR_ROTATE_ANGLE')
        .throttleTime(100)
);

const cursor = (state, action) => {
    switch (action.type) {
        case 'VIRTUALASSET_PAINTTOOL_CURSOR_ARRANGE_SELECT':
            return state.set('arrangeViewMode', action.direction);

        case 'VIRTUALASSET_PAINTTOOL_CURSOR_CHANGE_POSITION_VIEWMODE':
            return state.setIn(['position', 'viewMode'], action.viewMode);

        case 'VIRTUALASSET_PAINTTOOL_CURSOR_MODE':
            return state.set('mode', action.mode);

        case 'VIRTUALASSET_PAINTTOOL_CURSOR_CHANGE_POSTION_BRACKET':
            return state.setIn(['position', 'bracket'], action.bracket);

        case 'VIRTUALASSET_PAINTTOOL_CURSOR_FLIP_SELECT':
            return state.setIn(['rotate', 'flip'], action.direction);

        case 'VIRTUALASSET_PAINTTOOL_CURSOR_ROTATE_ANGLE':
            return state.setIn(['rotate', 'angle'], parseInt(action.angle, 10));

        case 'VIRTUALASSET_PAINTTOOL_CURSOR_SELECT_END':
            return state.set('select', false);

        case 'VIRTUALASSET_PAINTTOOL_CURSOR_SELECT_MOUSEDOWN':
            state = state.set('select', true);
            state = state.setIn(['rotate', 'angle'], 0);
            return state.set('pick', action.pick);

        case 'VIRTUALASSET_PAINTTOOL_CURSOR_SELECT_MOUSEUP':
            return state.setIn(['pick', 'trigger'], false);

        case 'VIRTUALASSET_PAINTTOOL_CURSOR_POSITION_SIZE_CHNAGE_VALUE':
            if (action.direction === 'top') {
                if (action.bracket === 'top') {
                    state = state.updateIn(['position', 'height'], value => value + 1);
                } else {
                    state = state.updateIn(['position', 'height'], value => value - 1);
                }
            } else if (action.direction === 'left') {
                if (action.bracket === 'left') {
                    state = state.updateIn(['position', 'width'], value => value + 1);
                } else {
                    state = state.updateIn(['position', 'width'], value => value - 1);
                }
            } else if (action.direction === 'right') {
                if (action.bracket === 'right') {
                    state = state.updateIn(['position', 'width'], value => value + 1);
                } else {
                    state = state.updateIn(['position', 'width'], value => value - 1);
                }
            } else if (action.direction === 'bottom') {
                if (action.bracket === 'bottom') {
                    state = state.updateIn(['position', 'height'], value => value + 1);
                } else {
                    state = state.updateIn(['position', 'height'], value => value - 1);
                }
            }
            return state.setIn(['position', 'bracket'], action.bracket);

        case 'VIRTUALASSET_PAINTTOOL_CURSOR_POSITION_SIZE_RESET':
            state = state.setIn(['rotate', 'angle'], 0);
            state = state.setIn(['position', 'height'], 0);
            return state.setIn(['position', 'width'], 0);

        default:
            return state;
    }
};

export { cursor as default, rotateEpic };

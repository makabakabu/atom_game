const region = ({ state, action }) => {
    switch (action.type) {
        case 'VIRTUALASSET_PAINTTOOL_REGION_VIEWMODE':
            return state.set('viewMode', action.viewMode);

        case 'VIRTUALASSET_PAINTTOOL_REGION_MODE':
            return state.set('mode', action.mode);

        case 'VIRTUALASSET_PAINTTOOL_REGION_INPUT':
            return state.set(action.kind, action.value);

        case 'VIRTUALASSET_PIANTTOOL_REGION_SELECT_MOUSEDOWN':
            state = state.set('start', action.start);
            return state.set('click', action.click);

        case 'VIRTUALASSET_PAINTTOOL_REGION_POSITION_LOCATION_CHNAGE_VALUE':
            if (action.direction === 'top') {
                state = state.update('region', value => value.map(cell => cell.update('row', row => row - 1)));
                return state.updateIn(['location', 'y'], value => value - 1);
            } else if (action.direction === 'left') {
                state = state.update('region', value => value.map(cell => cell.update('col', col => col - 1)));
                return state.updateIn(['location', 'x'], value => value - 1);
            } else if (action.direction === 'right') {
                state = state.update('region', value => value.map(cell => cell.update('col', col => col + 1)));
                return state.updateIn(['location', 'x'], value => value + 1);
            }
            state = state.update('region', value => value.map(cell => cell.update('row', row => row + 1)));
            return state.updateIn(['location', 'y'], value => value + 1);

        default:
            return state;
    }
};

export default region;

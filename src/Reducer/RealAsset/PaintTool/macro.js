import { List, Map } from 'immutable';

const macroReducer = (state, action) => {
    switch (action.type) {
        case 'PAINTTOOL_MACRO_COLOR':
            return state.set('hex', action.hex);

        case 'PAINTTOOL_MACRO_CURSOR_SELECT_MOUSEDOWN':
            return state.set('region', action.region);

        case 'PAINTTOOL_MACRO_CURSOR_FLIP_SELECT': {
            let region = state.get('region');
            const regionReverse = ({ regionList }) => {
                let regionPart = regionList.skipUntil(rowList => rowList.some(cell => cell.get('hex') !== '#ededed')).reverse().skipUntil(rowList => rowList.some(cell => cell.get('hex') !== '#ededed'));
                regionPart = regionList.takeUntil(rowList => rowList.some(cell => (cell.get('hex') !== '#ededed'))).concat(regionPart);
                return regionPart.concat(List([...Array(regionList.size - regionPart.size)].map(() => List(Array(regionList.get(0).size).fill(Map({ hex: '#ededed', opacity: 1 }))))));
            };
            const transpose = ({ regionList }) => {
                let valueMatrixTemp = List([]);
                for (let i = 0; i < regionList.get(0).size; i += 1) {
                    valueMatrixTemp = valueMatrixTemp.push(regionList.map(rowList => (rowList.get(i))));
                }
                return valueMatrixTemp;
            };
            if (action.direction === 'vertical') {
                region = transpose({ regionList: regionReverse({ regionList: transpose({ regionList: region }) }) });
            } else if (action.direction === 'horizontal') {
                region = regionReverse({ regionList: region });
            }
            return state.set('region', region);
        }

        case 'PAINTTOOL_MACRO_CURSOR_POSITION_LOCATION_CHNAGE_VALUE':
            if (action.direction === 'top') {
                state = state.update('region', value => value.rest().push(List(Array(value.get(0).size).fill(Map({ hex: '#ededed', opacity: 1 })))));
            } else if (action.direction === 'left') {
                state = state.update('region', value => value.map(rowList => rowList.slice(1).push(Map({ hex: '#ededed', opacity: 1 }))));
            } else if (action.direction === 'right') {
                state = state.update('region', value => value.map(rowList => List([]).push(Map({ hex: '#ededed', opacity: 1 })).concat(rowList.slice(0, -1))));
            } else {
                state = state.update('region', value => List([]).push(List(Array(value.get(0).size).fill(Map({ hex: '#ededed', opacity: 1 })))).concat(value.slice(0, -1)));
            }
            return state;

        default:
            return state;
    }
};

export default macroReducer;

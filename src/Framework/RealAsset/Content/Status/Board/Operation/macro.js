import { List } from 'immutable';

const macro = {
    color: ({ region, valueList, row, col }) => {
        if (region.getIn([row, col, 'inner'])) {
            return region.getIn([row, col]);
        }
        return valueList.getIn([row, col]);
    },
    border: ({ region, row, col }) => {
        let border = List([]);
        if (region.getIn([row, col, 'inner'])) {
            if ((row > 0 && !region.getIn([row - 1, col, 'inner'])) || row === 0) {
                border = border.push(1);
            }
            if ((col > 0 && !region.getIn([row, col - 1, 'inner'])) || col === 0) {
                border = border.push(2);
            }
            if ((((row + 1) < region.size) && !region.getIn([row + 1, col, 'inner'])) || (row === (region.size - 1))) {
                border = border.push(3);
            }
            if ((((col + 1) < region.get(0).size) && !region.getIn([row, col + 1, 'inner'])) || (col === (region.get(0).size - 1))) {
                border = border.push(4);
            }
        }
        return border;
    },
    valueMatrix: ({ region }) => {
        const transpose = ({ regionList }) => {
            let valueMatrixTemp = List([]);
            for (let i = 0; i < regionList.get(0).size; i += 1) {
                valueMatrixTemp = valueMatrixTemp.push(regionList.map(rowList => (rowList.get(i))));
            }
            return valueMatrixTemp;
        };
        const minRow = region.findIndex(rowList => rowList.some(cell => cell.get('inner')));
        const minCol = transpose({ regionList: region }).findIndex(rowList => rowList.some(cell => cell.get('inner')));
        let partRegion = region.skipUntil(rowList => rowList.some(cell => cell.get('inner'))).reverse().skipUntil(rowList => rowList.some(cell => cell.get('inner'))).reverse();
        partRegion = transpose({ regionList: transpose({ regionList: partRegion }).skipUntil(rowList => rowList.some(cell => cell.get('inner'))).reverse().skipUntil(rowList => rowList.some(cell => cell.get('inner')))
        .reverse() });
        return { minRow, minCol, partRegion };
    },
    point2valueMatrix: ({ boundaryList, valueMatrix, row, col }) => {
        valueMatrix = valueMatrix.setIn([row, col], 2);
        const swell = ({ boundary, valuePara }) => {
            let newCellList = List([]);
            boundary.forEach((boundaryCell) => { // 可以缩减
                for (let j = boundaryCell.get(1) - 1; j >= 0; j -= 1) {
                    if (valuePara.getIn([boundaryCell.get(0), j]) === 1) {
                        newCellList = newCellList.push(List([boundaryCell.get(0), j]));
                        valuePara = valuePara.setIn([boundaryCell.get(0), j], 2);
                    } else {
                        break;
                    }
                }
                for (let j = boundaryCell.get(1) + 1; j < valuePara.get(0).size; j += 1) {
                    if (valuePara.getIn([boundaryCell.get(0), j]) === 1) {
                        newCellList = newCellList.push(List([boundaryCell.get(0), j]));
                        valuePara = valuePara.setIn([boundaryCell.get(0), j], 2);
                    } else {
                        break;
                    }
                }
                for (let i = boundaryCell.get(0) - 1; i >= 0; i -= 1) {
                    if (valuePara.getIn([i, boundaryCell.get(1)]) === 1) {
                        newCellList = newCellList.push(List([i, boundaryCell.get(1)]));
                        valuePara = valuePara.setIn([i, boundaryCell.get(1)], 2);
                    } else {
                        break;
                    }
                }
                for (let i = boundaryCell.get(0) + 1; i < valuePara.size; i += 1) {
                    if (valuePara.getIn([i, boundaryCell.get(1)]) === 1) {
                        newCellList = newCellList.push(List([i, boundaryCell.get(1)]));
                        valuePara = valuePara.setIn([i, boundaryCell.get(1)], 2);
                    } else {
                        break;
                    }
                }
            });
            // newCellList是否有新的boundaryCell
            boundary = List([]);
            newCellList.forEach((cell) => {
                if ((cell.get(0) >= 1 && valuePara.getIn([cell.get(0) - 1, cell.get(1)]) === 1) ||
                    (cell.get(0) < valuePara.size - 1 && valuePara.getIn([cell.get(0) + 1, cell.get(1)]) === 1) ||
                    (cell.get(1) >= 1 && valuePara.getIn([cell.get(0), cell.get(1) - 1]) === 1) ||
                    (cell.get(1) < valuePara.get(0).size - 1 && valuePara.getIn([cell.get(0), cell.get(1) + 1]) === 1)) {
                        boundary = boundary.push(cell);
                }
            });
            if (boundary.size !== 0) {
                return swell({ boundary, valuePara });
            }
            return valuePara;
        };
        return swell({ boundary: boundaryList, valuePara: valueMatrix });
    },
};

export default macro;

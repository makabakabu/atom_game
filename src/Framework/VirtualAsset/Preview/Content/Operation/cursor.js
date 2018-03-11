import { List, Map } from 'immutable';
import macro from './macro';

const cursor = ({
    select: ({ region, mode, row, col, figureId, valueList, value, colLength, rowLength }) => {
        if (!['#ededed', '#cccccc'].includes(value.get('hex')) && !region.getIn([row, col, 'inner'])) {
            region.forEach((rowList, rowIndex) => rowList.forEach((cell, colIndex) => {
                if (cell.get('inner')) {
                    document.getElementById(`${figureId + rowIndex}_${colIndex}`).style.border = 'none';
                }
            })); // 释放先前的region，新建新的region
            const boundaryList = List([List([row, col])]);
            // 形成连通图， 有的位置为2
            let valueMatrix = valueList.map(rowList => rowList.map((cell) => {
                if (mode === 'outline') {
                    if (cell.get('hex') !== '#ededed') {
                        return 1;
                    }
                    return 0;
                }
                if (cell.get('hex') === value.get('hex') && cell.get('opacity') === value.get('opacity')) {
                    return 1;
                }
                return 0;
            }));
            valueMatrix = macro.point2valueMatrix({ boundaryList, valueMatrix, row, col });
            region = List([...Array(region.size)].map(() => List(Array(region.get(0).size).fill(Map({ hex: '#ededed', opacity: 1, inner: false })))));
            valueMatrix.forEach((rowList, rowIndex) => {
                rowList.forEach((cell, colIndex) => {
                    if (cell === 2) {
                        region = region.setIn([rowIndex, colIndex], valueList.getIn([rowIndex, colIndex]).set('inner', true));
                        let border = List([]);
                        if ((rowIndex > 0 && valueMatrix.getIn([rowIndex - 1, colIndex]) === 0) || rowIndex === 0) {
                            border = border.push(1);
                        }
                        if ((colIndex > 0 && valueMatrix.getIn([rowIndex, colIndex - 1]) === 0) || colIndex === 0) {
                            border = border.push(2);
                        }
                        if ((rowIndex < rowLength - 1 && valueMatrix.getIn([rowIndex + 1, colIndex]) === 0) || (rowIndex === rowLength - 1)) {
                            border = border.push(3);
                        }
                        if ((colIndex < colLength - 1 && valueMatrix.getIn([rowIndex, colIndex + 1]) === 0) || (colIndex === colLength - 1)) {
                            border = border.push(4);
                        }
                        document.getElementById(`${figureId + rowIndex}_${colIndex}`).style.borderTop = border.includes(1) ? '1px dashed black' : 'none';
                        document.getElementById(`${figureId + rowIndex}_${colIndex}`).style.borderLeft = border.includes(2) ? '1px dashed black' : 'none';
                        document.getElementById(`${figureId + rowIndex}_${colIndex}`).style.borderBottom = border.includes(3) ? '1px dashed black' : 'none';
                        document.getElementById(`${figureId + rowIndex}_${colIndex}`).style.borderRight = border.includes(4) ? '1px dashed black' : 'none';
                    }
                });
            });
        } else if (['#ededed', '#cccccc'].includes(value.get('hex')) && region.some(rowList => rowList.some(cell => cell.get('inner')))) { // 目前点到空白部分，region中包含颜色部分
            region.forEach((rowList, rowIndex) => rowList.forEach((cell, colIndex) => {
                if (cell.get('inner')) {
                    document.getElementById(`${figureId + rowIndex}_${colIndex}`).style.border = 'none';
                }
            }));
            region = List([...Array(region.size)].map(() => List(Array(region.get(0).size).fill(Map({ hex: '#ededed', opacity: 1, inner: false })))));
        }
        return region;
    },
    pick: ({ paintToolOperation, row, col, region, valueList, figureId }) => {
        // 塑造 curseRegion 与新的valueList结合，然后找出border就完事。
        let cursorRegion = List([]);
        const halfMoveRowNum = (row - paintToolOperation.getIn(['pick', 'row'])) / 2;
        const halfMoveColNum = (col - paintToolOperation.getIn(['pick', 'col'])) / 2;
        for (let i = 0; i < region.size + Math.round(Math.abs(halfMoveRowNum * 2)); i += 1) {
            const rowNum = i - Math.round(Math.abs(halfMoveRowNum) + halfMoveRowNum);
            const colNum = Math.round(halfMoveColNum * 2);
            let rowList = List([]);
            if (rowNum >= 0 && rowNum < region.size) {
                // slice colNum
                if (colNum > 0) {
                    rowList = List(Array(Math.abs(colNum)).fill(Map({ hex: '#ededed', opacity: 1, inner: false }))).concat(region.get(rowNum));
                } else {
                    rowList = region.get(rowNum).concat(List(Array(Math.abs(colNum)).fill(Map({ hex: '#ededed', opacity: 1, inner: false }))));
                }
            } else {
                rowList = List(Array(region.get(0).size + Math.abs(colNum)).fill(Map({ hex: '#ededed', opacity: 1, inner: false })));
            }
            cursorRegion = cursorRegion.push(rowList);
        }
        cursorRegion = cursorRegion.filter((rowList, cursorRowIndex) => {
            const rowIndex = cursorRowIndex - Math.round(Math.abs(halfMoveRowNum) - halfMoveRowNum);
                return rowIndex >= 0 && rowIndex < region.size;
            }).map(rowList =>
                (rowList.filter((cell, cursorColIndex) => {
                        const colIndex = cursorColIndex - Math.round(Math.abs(halfMoveColNum) - halfMoveColNum);
                        return colIndex >= 0 && colIndex < region.get(0).size;
                    })));
        valueList.forEach((rowList, rowIndex) => {
            rowList.forEach((cell, colIndex) => {
                document.getElementById(`${figureId + rowIndex}_${colIndex}`).style.backgroundColor = `rgba(${parseInt(cell.get('hex').substr(1, 2), 16)},${parseInt(cell.get('hex').substr(3, 2), 16)},${parseInt(cell.get('hex').substr(5, 2), 16)},${cell.get('opacity')})`;
                document.getElementById(`${figureId + rowIndex}_${colIndex}`).style.border = 'none';
            });
        });
        cursorRegion.forEach((rowList, rowIndex) => {
            rowList.forEach((cell, colIndex) => {
                if (cell.get('inner')) {
                    const border = macro.border({ region: cursorRegion, row: rowIndex, col: colIndex });
                    document.getElementById(`${figureId + rowIndex}_${colIndex}`).style.backgroundColor = `rgba(${parseInt(cell.get('hex').substr(1, 2), 16)},${parseInt(cell.get('hex').substr(3, 2), 16)},${parseInt(cell.get('hex').substr(5, 2), 16)},${cell.get('opacity')})`;
                    document.getElementById(`${figureId + rowIndex}_${colIndex}`).style.borderTop = border.includes(1) ? '1px dashed black' : 'none';
                    document.getElementById(`${figureId + rowIndex}_${colIndex}`).style.borderLeft = border.includes(2) ? '1px dashed black' : 'none';
                    document.getElementById(`${figureId + rowIndex}_${colIndex}`).style.borderBottom = border.includes(3) ? '1px dashed black' : 'none';
                    document.getElementById(`${figureId + rowIndex}_${colIndex}`).style.borderRight = border.includes(4) ? '1px dashed black' : 'none';
                }
            });
        });
        return cursorRegion;
    },
});

export default cursor;

import { List, Map } from 'immutable';
import macro from './macro';

const regionOperation = ({
    select: ({ regionPreCursor, row, col, figureId }) => {
        // 首先判断row, col和precursor的方位
        const borderMap = {
            leftTop: List([1, 2]),
            leftBottom: List([2, 3]),
            rightBottom: List([3, 4]),
            rightTop: List([4, 1]),
        };
        let border;
        if (row > regionPreCursor.get('row') && col >= regionPreCursor.get('col')) {
            border = borderMap.leftTop;
        } else if (row <= regionPreCursor.get('row') && col > regionPreCursor.get('col')) {
            border = borderMap.leftBottom;
        } else if (row < regionPreCursor.get('row') && col <= regionPreCursor.get('col')) {
            border = borderMap.rightBottom;
        } else {
            border = borderMap.rightTop;
        }
        document.getElementById(`${figureId + row}_${col}`).style.borderTop = border.includes(1) ? '1px dashed black' : 'none';
        document.getElementById(`${figureId + row}_${col}`).style.borderLeft = border.includes(2) ? '1px dashed black' : 'none';
        document.getElementById(`${figureId + row}_${col}`).style.borderBottom = border.includes(3) ? '1px dashed black' : 'none';
        document.getElementById(`${figureId + row}_${col}`).style.borderRight = border.includes(4) ? '1px dashed black' : 'none';
    },
    pick: ({ startCursor, region, operation, mode, row, col, figureId }) => {
        // 判断是哪一种模式，
        // 1. move模式 直接移动所选区域位置, 移动他
        // 2. create模式
        // a. 直接清除所有区域，
        // b. 框选元素
        // c. 加入新的元素
        // 3. add模式，不需要判断是否连接区域，其余类似create模式
        // 4. minus模式, 需要判断是否为连接区域，若连接，则将选中区域的值变为0，
        // 非连接的不做任何变化
        const transpose = ({ region }) => {
            let regionTemp = List([]);
            for (let i = 0; i < region.get(0).size; i += 1) {
                regionTemp = regionTemp.push(region.map(rowList => rowList.get(i)));
            }
            return regionTemp;
        };
        const replace = ({ region, row, col, replaceRegion }) => {
            for (let i = row; i < Math.min(row + replaceRegion.size, region.size); i += 1) {
                for (let j = col; j < Math.min(col + replaceRegion.get(0).size, region.get(0).size); j += 1) {
                    region = region.setIn([i, j], replaceRegion.getIn([row - i, col - j]));
                }
            }
            return region;
        };
        const frameSelect = ({ region, start, end }) => {
            const minRow = Math.min(start.get('row'), end.get('row'));
            const maxRow = Math.max(start.get('row'), end.get('row'));
            const minCol = Math.min(start.get('col'), end.get('col'));
            const maxCol = Math.max(start.get('col'), end.get('col'));
            let regionTemp = transpose({ region: region.slice(minRow, maxRow).push(region.get(maxRow)) });
            regionTemp = transpose({ region: regionTemp.slice(minCol, maxCol).push(regionTemp.get(maxCol)) });
            return { minRow, minCol, replaceRegion: regionTemp };
        }; // 获取region中start和end的部分
        switch (operation) {
            case 'create': {
                let { replaceRegion, minRow, minCol } = frameSelect({ region, start: startCursor, end: Map({ row, col }) });
                replaceRegion = replaceRegion.map(rowList => rowList.map(cell => cell.set('inner', true)));
                region = replace({ region: region.map(rowList => rowList.map(cell => cell.set('inner', false))), row: minRow, col: minCol, replaceRegion });
                break;
            }

            case 'plus':
                if (mode === 'outline') {
                    let { replaceRegion, minRow, minCol } = frameSelect({ region, start: startCursor, end: Map({ row, col }) });
                    replaceRegion = replaceRegion.map(rowList => rowList.map(cell => cell.set('inner', true)));
                    region = replace({ region, row: minRow, col: minCol, replaceRegion });
                } else {
                    region = replace({ region, row, col, replaceRegion: List([List([region.setIn([row, col, 'inner'], true).getIn([row, col])])]) });
                }
                break;

            case 'minus':
                if (mode === 'outline') {
                    let { replaceRegion, minRow, minCol } = frameSelect({ region, start: startCursor, end: Map({ row, col }) });
                    replaceRegion = replaceRegion.map(rowList => rowList.map(cell => cell.set('inner', false)));
                    region = replace({ region, row: minRow, col: minCol, replaceRegion });
                } else {
                    region = region.setIn([row, col, 'inner'], false);
                }
                break;

            default:
                break;
        }
        // form the border
        region.forEach((rowList, rowIndex) => {
            rowList.forEach((cell, colIndex) => {
                const border = macro.border({ region, row: rowIndex, col: colIndex });
                document.getElementById(`${figureId + rowIndex}_${colIndex}`).style.borderTop = border.includes(1) ? '1px dashed black' : 'none';
                document.getElementById(`${figureId + rowIndex}_${colIndex}`).style.borderLeft = border.includes(2) ? '1px dashed black' : 'none';
                document.getElementById(`${figureId + rowIndex}_${colIndex}`).style.borderBottom = border.includes(3) ? '1px dashed black' : 'none';
                document.getElementById(`${figureId + rowIndex}_${colIndex}`).style.borderRight = border.includes(4) ? '1px dashed black' : 'none';
            });
        });
        return region;
    },
    mouseLeave: ({ region, row, col, figureId }) => {
        if (!region.getIn([row, col, 'inner'])) {
            document.getElementById(`${figureId + row}_${col}`).style.border = 'none';
        } else {
            const border = macro.border({ region, row, col });
            document.getElementById(`${figureId + row}_${col}`).style.borderTop = border.includes(1) ? '1px dashed black' : 'none';
            document.getElementById(`${figureId + row}_${col}`).style.borderLeft = border.includes(2) ? '1px dashed black' : 'none';
            document.getElementById(`${figureId + row}_${col}`).style.borderBottom = border.includes(3) ? '1px dashed black' : 'none';
            document.getElementById(`${figureId + row}_${col}`).style.borderRight = border.includes(4) ? '1px dashed black' : 'none';
        }
    },
});

export default regionOperation;

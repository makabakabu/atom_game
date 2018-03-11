import { List, Map } from 'immutable';
import macro from './macro';

const shape = ({
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
    pick: ({ startCursor, region, operation, shapeOperation, row, col, figureId }) => {
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
                    region = region.setIn([i, j], replaceRegion.getIn([i - row, j - col]));
                }
            }
            return region;
        };
        const frameSelect = ({ region, start, end, thickness = 0 }) => {
            const minRow = Math.max(Math.min(start.get('row'), end.get('row')) - thickness, 0);
            const maxRow = Math.min(Math.max(start.get('row'), end.get('row')) + thickness, region.size - 1);
            const minCol = Math.max(Math.min(start.get('col'), end.get('col')) - thickness, 0);
            const maxCol = Math.min(Math.max(start.get('col'), end.get('col')) + thickness, region.get(0).size - 1);
            let regionTemp = transpose({ region: region.slice(minRow, maxRow).push(region.get(maxRow)) });
            regionTemp = transpose({ region: regionTemp.slice(minCol, maxCol).push(regionTemp.get(maxCol)) });
            return { minRow, minCol, replaceRegion: regionTemp };
        }; // 获取region中start和end的部分
        region = region.map(rowList => rowList.map(cell => cell.set('inner', false)));
        /**
         * 1.一个map, 包含归属的判定条件，包括有thickness和无thickness的。
         * @param  {[type]} operation [description]
         * @return {[type]}           [description]
         */
        const shapeMap = {
            rectangle: ({ rowIndex, colIndex, center }) => true,
            rectangleThickness: ({ rowIndex, colIndex, center, thickness }) => (
                Math.abs(rowIndex - center[0]) <= center[0] - thickness && Math.abs(colIndex - center[1]) <= center[1] - thickness
            ),
            elipse: ({ rowIndex, colIndex, center }) => {
                const angle = Math.atan(Math.abs(colIndex - center[1]) / Math.abs(rowIndex - center[0]));
                return (((rowIndex - center[0]) ** 2) + ((colIndex - center[1]) ** 2)) <= (((center[1] * Math.sin(angle)) ** 2) + ((center[0] * Math.cos(angle)) ** 2));
            },
            elipseThickness: ({ rowIndex, colIndex, center, thickness }) => {
                const angle = Math.atan(Math.abs(colIndex - center[1]) / Math.abs(rowIndex - center[0]));
                return (((rowIndex - center[0]) ** 2) + ((colIndex - center[1]) ** 2)) <= ((((center[1] - thickness) * Math.sin(angle)) ** 2) + (((center[0] - thickness) * Math.cos(angle)) ** 2));
            },
            polygon3: ({ rowIndex, colIndex, center }) => (
                rowIndex >= ((Math.abs(colIndex - center[1]) * 2 * center[0]) / center[1])
            ),
            polygon3Thickness: ({ rowIndex, colIndex, center, thickness }) => (
                rowIndex >= (((Math.abs(colIndex - center[1]) + thickness) * 2 * center[0]) / center[1]) && rowIndex <= ((center[0] * 2) - thickness)
            ),
            polygon4: ({ rowIndex, colIndex, center }) => (
                (Math.abs(rowIndex - center[0]) * center[1]) <= ((center[0] * center[1]) - (center[0] * Math.abs(colIndex - center[1])))
            ),
            polygon4Thickness: ({ rowIndex, colIndex, center, thickness }) => (
                (Math.abs(rowIndex - center[0]) * (center[1] - thickness)) <= (((center[0] - thickness) * (center[1] - thickness)) - ((center[0] - thickness) * Math.abs(colIndex - center[1])))
            ),
            polygon5: ({ rowIndex, colIndex, center }) => (
                ((rowIndex < center[0]) && (rowIndex >= ((center[0] / center[1]) * Math.abs(colIndex - center[1])))) ||
                ((rowIndex >= center[0]) && (((rowIndex * center[1]) + (2 * (center[0] * Math.abs(colIndex - center[1])))) <= (3 * center[0] * center[1])))
            ),
            polygon5Thickness: ({ rowIndex, colIndex, center, thickness }) => (
                ((rowIndex < center[0]) && ((rowIndex - thickness) >= ((center[0] / center[1]) * Math.abs(colIndex - center[1])))) ||
                ((rowIndex >= center[0]) && (rowIndex <= ((2 * center[0]) - thickness)) && (((rowIndex * (center[1] - thickness)) + (2 * ((center[0] - thickness) * Math.abs(colIndex - center[1])))) <= (3 * (center[0] - thickness) * (center[1] - thickness))))
            ),
            polygon6: ({ rowIndex, colIndex, center }) => (
                (Math.abs(rowIndex - center[0]) * (1 + (Math.sqrt(2) / 2)) * center[1]) <= (((1 + (Math.sqrt(2) / 2)) * (center[0] * center[1])) - (center[0] * Math.abs(colIndex - center[1])))
            ),
            polygon6Thickness: ({ rowIndex, colIndex, center, thickness }) => (
                (Math.abs(rowIndex - center[0]) * (1 + (Math.sqrt(2) / 2)) * (center[1] - thickness)) <= (((1 + (Math.sqrt(2) / 2)) * (center[0] - thickness) * (center[1] - thickness)) - ((center[0] - thickness) * Math.abs(colIndex - center[1]))) && Math.abs(colIndex - center[1]) <= (center[1] - thickness)
            ),
        };
        let hex = '#ededed';
        let opacity = 1;
        let inner = false;
        if (shapeOperation.getIn(['fill', 'selected'])) {
            hex = shapeOperation.getIn(['fill', 'hex']);
            opacity = shapeOperation.getIn(['fill', 'opacity']);
            inner = true;
        } else {
            hex = '#ededed';
            opacity = 1;
            inner = false;
        }
        if (shapeOperation.getIn(['stroke', 'selected'])) {
            const thickness = shapeOperation.getIn(['stroke', 'thickness']);
            let { replaceRegion, minRow, minCol } = frameSelect({ region, start: startCursor, end: Map({ row, col }), thickness });
            const center = [(replaceRegion.size - 1) / 2, (replaceRegion.get(0).size - 1) / 2];
            replaceRegion = replaceRegion.map((rowList, rowIndex) => rowList.map((cell, colIndex) => {
                if (shapeMap[operation === 'polygon' ? `polygon${shapeOperation.get('edges')}` : operation]({ rowIndex, colIndex, center })) {
                    return Map({ hex: shapeOperation.getIn(['stroke', 'hex']), opacity: shapeOperation.getIn(['stroke', 'opacity']), inner: true });
                }
                return Map({ hex: '#ededed', opacity: 1, inner: false });
            }));
            replaceRegion = replaceRegion.map((rowList, rowIndex) => rowList.map((cell, colIndex) => {
                if (shapeMap[operation === 'polygon' ? `polygon${shapeOperation.get('edges')}Thickness` : `${operation}Thickness`]({ rowIndex, colIndex, center, thickness })) {
                    return Map({ hex, opacity, inner });
                }
                return cell;
            }));
            region = replace({ region, row: minRow, col: minCol, replaceRegion });
        } else {
            let { replaceRegion, minRow, minCol } = frameSelect({ region, start: startCursor, end: Map({ row, col }) });
            const center = [(replaceRegion.size - 1) / 2, (replaceRegion.get(0).size - 1) / 2];
            replaceRegion = replaceRegion.map((rowList, rowIndex) => rowList.map((cell, colIndex) => {
                if (shapeMap[operation === 'polygon' ? `polygon${shapeOperation.get('edges')}` : operation]({ rowIndex, colIndex, center })) {
                    return Map({ hex, opacity, inner });
                }
                return Map({ hex: '#ededed', opacity: 1, inner: false });
            }));
            region = replace({ region, row: minRow, col: minCol, replaceRegion });
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

export default shape;

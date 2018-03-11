import { List, OrderedMap, Map } from 'immutable';
import macro from './macro';

const formCell = ({ region, size, angle }) => {
    // 首先将paintToolCursorRegion变成matrix, 然后得出每一行每一列的比例，将整数的先铁甲，剩余的最高的几个比例，分配，如果
    // 生成一个tuple List, 对应于行数与比例，取前几个
    // 如果最后几个比例相同的话，则选择靠中间的增加行数
    // 多边形和旋转

    // 如果有数据和center的话
    // 计算中心点到数据的长度
    // 重新计算角度，
    // 对应长度和角度的点落在什么位置
    // 建立一个新的matrix width， 2倍的较长边， 中心点在中间
    const result = macro.valueMatrix({ region });
    const { minRow, minCol } = result;
    let valueMatrix = result.partRegion;
    valueMatrix = cursorSizeForm({ valueMatrix, size });
    region = List([...Array(minRow)].map(() => List(Array(region.get(0).size).fill(Map({ hex: '#ededed', opacity: 1, inner: false }))))).concat(valueMatrix.map(rowList => List(Array(minCol).fill(Map({ hex: '#ededed', opacity: 1, inner: false }))).concat(rowList).concat(Array(region.get(0).size - minCol - valueMatrix.get(0).size).fill(Map({ hex: '#ededed', opacity: 1, inner: false }))))).concat(List([...Array(region.size - valueMatrix.size - minRow)].map(() => List(Array(region.get(0).size).fill(Map({ hex: '#ededed', opacity: 1, inner: false }))))));
    if (angle > 0) {
        region = cursorRotationForm({ region, angle });
    }
    return region;
};

const transpose = ({ valueMatrix }) => {
    let valueMatrixTemp = List([]);
    for (let i = 0; i < valueMatrix.get(0).size; i += 1) {
        valueMatrixTemp = valueMatrixTemp.push(valueMatrix.map(rowList => (rowList.get(i))));
    }
    return valueMatrixTemp;
};

const cursorSizeForm = ({ valueMatrix, size }) => {
    const ratioMap = ({ rowRatioMap, valueMatrix, firstRowNum }) => {
        let lastRowNum = firstRowNum;
        if (valueMatrix.size > 1) {
            const firstRow = valueMatrix.first();
            const restValueMatrix = valueMatrix.rest();
            restValueMatrix.forEach((rowList) => {
                if (firstRow.equals(rowList)) {
                    lastRowNum += 1;
                    return true;
                }
                return false;
            });
        }
        rowRatioMap = rowRatioMap.concat(OrderedMap({ [`${firstRowNum}_${lastRowNum}`]: (lastRowNum - firstRowNum) + 1 }));
        if (lastRowNum === (firstRowNum + valueMatrix.size) - 1) {
            return rowRatioMap;
        }
        return ratioMap({ rowRatioMap, valueMatrix: valueMatrix.slice((lastRowNum - firstRowNum) + 1), firstRowNum: lastRowNum + 1 });
    };
    const reshapeRegion = ({ valueMatrix, rowNum, ratioMap }) => {
        let rowRatioMap = ratioMap({ rowRatioMap: OrderedMap({}), valueMatrix, firstRowNum: 0 }).sort((a, b) => (a > b ? -1 : 1)); // 获取每一种类型对应有几个连续行
        let rowAddMap = rowRatioMap.map(() => (0));
        const operation = rowNum > 0 ? 1 : -1;
        let rowRatioMapTemp = rowRatioMap;
        const rest = Math.abs(rowNum);
        let volumn = rest;
        rowRatioMap.forEach((ratio, index) => {
            if (rest * ratio > valueMatrix.size) {
                const intNum = operation * Math.floor((ratio * rest) / valueMatrix.size);
                rowAddMap = rowAddMap.set(index, intNum);
                volumn -= Math.abs(intNum);
                rowRatioMapTemp = rowRatioMapTemp.update(index, value => value - intNum);
                return true;
            }
            return false;
        });
        rowRatioMapTemp = rowRatioMapTemp.sort((a, b) => (a > b ? -1 : 1));
        rowRatioMapTemp.forEach((ratio, index) => {
            if (volumn > 0) {
                rowAddMap = rowAddMap.update(index, value => value + operation);
                volumn -= 1;
            }
        });
        rowRatioMap = rowRatioMap.map((rowValue, rowIndex) => (rowValue + rowAddMap.get(rowIndex)));
        rowRatioMap = rowRatioMap.sortBy((rowRationValue, key) => parseInt(key.split('_')[0], 10), (a, b) => (a > b ? 1 : -1));
        let temp = List([]);
        rowRatioMap.forEach((ratio, index) => {
            for (let i = 0; i < ratio; i += 1) {
                temp = temp.push(valueMatrix.get(parseInt(index.split('_')[0], 10)));
            }
        });
        return temp;// 获取已经拍好序的valueMatrix
    };
    if (size.get('height') !== 0) {
        valueMatrix = reshapeRegion({ valueMatrix, rowNum: size.get('height'), ratioMap });
    }
    if (size.get('width') !== 0) {
        valueMatrix = transpose({ valueMatrix: reshapeRegion({ valueMatrix: transpose({ valueMatrix }), rowNum: size.get('width'), ratioMap }) });
    }
    return valueMatrix;
};

const cursorRotationForm = ({ region, angle }) => {
    // 首先找到中心点(center0, center1)
    const minRow = region.findIndex(rowList => rowList.some(cell => cell.get('hex') !== '#ededed'));
    const maxRow = region.size - region.reverse().findIndex(rowList => rowList.some(cell => cell.get('hex') !== '#ededed')) - 1;
    const minCol = transpose({ valueMatrix: region }).findIndex(rowList => rowList.some(cell => cell.get('hex') !== '#ededed'));
    const maxCol = region.get(0).size - transpose({ valueMatrix: region }).reverse().findIndex(rowList => rowList.some(cell => cell.get('hex') !== '#ededed'));
    // adsfasdf
    let regionTemp = List([...Array(region.size)].map(() => List(Array(region.get(0).size).fill(Map({ hex: '#ededed', opacity: 1, inner: false })))));
    const center = [Math.floor((minRow + maxRow) / 2), Math.floor((maxCol + minCol) / 2)];
    regionTemp = regionTemp.setIn([center[0], center[1]], region.getIn([center[0], center[1]]));
    region.forEach((rowList, rowIndex) => {
        rowList.forEach((cell, colIndex) => {
            if (cell.get('hex') !== '#ededed') {
                const a = 1;
                const b = Math.sqrt(((rowIndex - center[0]) ** 2) + ((colIndex - center[1]) ** 2));
                const c = Math.sqrt(((rowIndex - center[0]) ** 2) + ((colIndex - center[1] - 1) ** 2));
                let preAngle = Math.acos((((b ** 2) + (a ** 2)) - (c ** 2)) / (2 * a * b)) * (180 / Math.PI);
                if (rowIndex < center[0]) {
                    preAngle = 360 - preAngle;
                }
                const aftAngle = (angle + preAngle) % 360;
                let row;
                let col;
                if (aftAngle < 180) {
                    row = Math.floor(center[0] + 0.5 + (b * Math.sin((aftAngle / 180) * Math.PI)));
                    col = Math.floor(center[1] + 0.5 + (b * Math.cos((aftAngle / 180) * Math.PI)));
                } else {
                    row = Math.floor((center[0] + 0.5) - (b * Math.sin(((aftAngle / 180) - 1) * Math.PI)));
                    col = Math.floor((center[1] + 0.5) - (b * Math.cos(((aftAngle / 180) - 1) * Math.PI)));
                }
                if (row >= 0 && row < region.size && col >= 0 && col < region.get(0).size) {
                    regionTemp = regionTemp.setIn([row, col], cell);
                }
            }
        });
    });
    return regionTemp;
};

export default formCell;

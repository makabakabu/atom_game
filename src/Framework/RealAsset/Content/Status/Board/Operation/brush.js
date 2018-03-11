import { List, Map } from 'immutable';

// region 是已经与valueList合并完成的结果

const brush = ({
    mouseEnter: ({
        row, col, paintToolOperation, hex, rowLength, colLength, statusId,
        brushRegion, viewMode,
    }) => {
        let mouseRegion = List([]);
        for (let i = row; i < row + paintToolOperation.get('pixelSize'); i += 1) {
            for (let j = col; j < col + paintToolOperation.get('pixelSize'); j += 1) {
                // 如果region为空， 或者在region中
                mouseRegion = mouseRegion.push(List([i, j]));
            }
        }// 计算笔刷覆盖区域
        mouseRegion.forEach((value) => {
            let border = [];
            if (value.get(0) === row) {
                border = [...border, 1];
            }
            if (value.get(1) === col) {
                border = [...border, 2];
            }
            if (value.get(0) === (row + paintToolOperation.get('pixelSize')) - 1) {
                border = [...border, 3];
            }
            if (value.get(1) === (col + paintToolOperation.get('pixelSize')) - 1) {
                border = [...border, 4];
            }
            if (value.get(0) < rowLength && value.get(1) < colLength) {
                document.getElementById(`${statusId + value.get(0)}_${value.get(1)}`).style.borderTop = border.includes(1) ? `1px solid ${hex}` : 'none';
                document.getElementById(`${statusId + value.get(0)}_${value.get(1)}`).style.borderLeft = border.includes(2) ? `1px solid ${hex}` : 'none';
                document.getElementById(`${statusId + value.get(0)}_${value.get(1)}`).style.borderBottom = border.includes(3) ? `1px solid ${hex}` : 'none';
                document.getElementById(`${statusId + value.get(0)}_${value.get(1)}`).style.borderRight = border.includes(4) ? `1px solid ${hex}` : 'none';
            }
        });// 通过dom操作形成笔刷边界
        if (paintToolOperation.get('mouseDown')) { // 开始刷笔刷
            mouseRegion.forEach((value) => {
                if (value.get(0) < rowLength && value.get(1) < colLength) {
                    document.getElementById(`${statusId + value.get(0)}_${value.get(1)}`).style.backgroundColor = viewMode === 'eraser' ? '#ededed' : `rgba(${parseInt(hex.substr(1, 2), 16)},${parseInt(hex.substr(3, 2), 16)},${parseInt(hex.substr(5, 2), 16)},${paintToolOperation.get('opacity')})`;
                }
            });
            brushRegion = brushRegion.concat(mouseRegion);
        }
        return Map({ brushRegion, mouseRegion });
    },
    mouseLeave: ({ mouseRegion, rowLength, colLength, statusId }) => {
        mouseRegion.forEach((value) => {
            if (value.get(0) < rowLength && value.get(1) < colLength) {
                document.getElementById(`${statusId + value.get(0)}_${value.get(1)}`).style.border = 'none';
            }
        });
    },
});

export default brush;

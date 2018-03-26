import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Button } from 'antd';
import Cell from './cell';

// 1.brush 点击获取其颜色和pixelSize, 决定border的size， 点击后拖动可连续着色
// brush
// 2.cursor 点击获取连着的区域，可以拖动, 作为region放到region里面，周围有虚线标志, 可以连续选中区域, 进行排列, 旋转, 翻转
// 3.shape a.矩阵，椭圆，多边形直接画，数据刚开始无法修改，拖好后可以修改，
// 4.region 有四种模式， 新建：新建新的会替代旧的；合并：会合并所有的region
// 5.bucket 根据region和hex来填充，
// 6.eraser 和brush一样不过颜色#ededed
const Content = ({
    figureId, rowLength, colLength, finishEdit,
}) => {
    const cellWidth = Math.min(640 / colLength, 427 / rowLength);
    const cellHeight = Math.min(426.6 / rowLength, 640 / colLength);
    const borderWidth = (colLength * 32) > (rowLength * 48) ? 640 : (640 * ((colLength * 32) / (rowLength * 48)));
    const borderHeight = (colLength * 32) < (rowLength * 48) ? 426.6 : (426.6 * ((rowLength * 48) / (colLength * 32)));
    const valueList = [...Array(rowLength)].map(() => Array(colLength).fill(0));
    return (
        <div style={{ width: document.documentElement.clientWidth - 510, height: document.documentElement.clientHeight - 120, display: 'flex', flexDirection: 'column', justifyContent: 'space-around', alignItems: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center' }}>
                <div id={`${figureId}board`} style={{ ...styles.board, height: borderHeight, width: borderWidth }} >
                    {
                        valueList.map((row, rowIndex) => row.map((cell, colIndex) => (<Cell
                          key={`${rowIndex}_${colIndex}`}
                          figureId={figureId}
                          width={cellWidth}
                          height={cellHeight}
                          row={rowIndex}
                          col={colIndex}
                        />)))
                    }
                </div>
            </div>
            <Button onClick={finishEdit}>完成编辑</Button>
        </div>
    );
};

Content.propTypes = {
    figureId: PropTypes.string.isRequired,
    rowLength: PropTypes.number.isRequired,
    colLength: PropTypes.number.isRequired,
    finishEdit: PropTypes.func.isRequired,
};

let styles = {
    main: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: 426.6,
        width: 640,
        marginTop: 20,
    },
    board: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexWrap: 'wrap',
    },
};

const mapStateToProps = (state) => {
    const virtualAssetViewMode = state.getIn(['virtualAsset', 'viewMode']);
    let focusedId = state.getIn(['virtualAsset', 'figure', 'focusedFigureId']);
    if (virtualAssetViewMode === 'animate') {
        focusedId = state.getIn(['virtualAsset', 'animate', 'focusedAnimateId']);
    }
    const focusedFigureId = state.getIn(['virtualAsset', virtualAssetViewMode, 'sequence', focusedId, 'figure', 'focusedFigureId']);
    const value = state.getIn(['virtualAsset', virtualAssetViewMode, 'sequence', focusedId, 'figure', 'sequence', focusedFigureId, 'value']);
    return {
        figureId: focusedFigureId,
        rowLength: value.size,
        colLength: value.get(0).size,
    };
};

const mapDispatchToProp = dispatch => ({
    finishEdit: () =>
        dispatch({
            type: 'VIRTUALASSET_FINISH_EDIT',
        }),
});

export default connect(mapStateToProps, mapDispatchToProp)(Content);

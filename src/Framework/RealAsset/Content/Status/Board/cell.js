import React from 'react';
import { connect } from 'react-redux';
import { List, Map } from 'immutable';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import macro from './Operation/macro';
import brush from './Operation/brush';
import cursor from './Operation/cursor';
import formCell from './Operation/formCell';
import regionOperation from './Operation/region';
import shape from './Operation/shape';

let global = Map({
    mouseRegion: List([]),
    brushRegion: List([]),
    valueList: List([...Array(32)].map(() => List(Array(48).fill(Map({ hex: '#ededed', opacity: 1 }))))), // 永远是最新结果
    region: List([...Array(32)].map(() => List(Array(48).fill(Map({ hex: '#ededed', opacity: 1,
    inner: false }))))), // 永远是最新结果
    regionPreCursor: Map({
        row: 0,
        col: 0,
    }),
});
const Cell = ({
    figureId, statusId, width, height, valueList, row, col, viewMode, region, hex, size, angle,
    paintToolOperation, mouseEnter, mouseLeave, mouseDown, mouseUp,
}) => {
    if (row === 0 && col === 0 && region.some(rowList => rowList.some(cell => cell.get('inner')))) {
        global = global.set('region', formCell({ region, size, angle }));
    } else if (region.get(0).size !== global.getIn(['region', 0]).size || region.size !== global.get('region').size) {
        global = global.set('region', region);
    }
    // valueList和region 合并
    // cursor时region包含色彩和inner
    // region时仅仅包含inner
    const value = global.getIn(['region', row, col, 'inner']) ? global.getIn(['region', row, col]) : global.getIn(['valueList', row, col]);
    const border = macro.border({ region: global.get('region'), row, col });
    // 形成borderList
    // rotate the region
    return (
      <div
        role="presentation"
        id={`${statusId + row}_${col}`}
        style={{
            backgroundColor: `rgba(${parseInt(value.get('hex').substr(1, 2), 16)},${parseInt(value.get('hex').substr(3, 2), 16)},${parseInt(value.get('hex').substr(5, 2), 16)},${value.get('opacity')})`,
            borderTop: border.includes(1) ? '1px dashed black' : 'none',
            borderLeft: border.includes(2) ? '1px dashed black' : 'none',
            borderBottom: border.includes(3) ? '1px dashed black' : 'none',
            borderRight: border.includes(4) ? '1px dashed black' : 'none',
            width,
            height,
        }}
        onMouseEnter={mouseEnter({
            row, col, figureId, statusId, hex, region, paintToolOperation, viewMode, width, height, valueList, value,
        })}
        onMouseLeave={mouseLeave({
            statusId, width, height, viewMode, paintToolOperation, valueList, col, row,
        })}
        onMouseDown={mouseDown({
            figureId, statusId, paintToolOperation, viewMode, valueList, width, height, row, col, value, hex, region,
        })}
        onMouseUp={mouseUp({
            viewMode, row, col, value, paintToolOperation, figureId, statusId, hex, valueList,
        })}
      />
    );
};

Cell.propTypes = {
    figureId: PropTypes.string.isRequired,
    statusId: PropTypes.string.isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    valueList: ImmutablePropTypes.list.isRequired,
    row: PropTypes.number.isRequired,
    col: PropTypes.number.isRequired,
    hex: PropTypes.string.isRequired,
    region: ImmutablePropTypes.list.isRequired,
    size: ImmutablePropTypes.map.isRequired,
    angle: PropTypes.number.isRequired,
    viewMode: PropTypes.string.isRequired,
    paintToolOperation: ImmutablePropTypes.map.isRequired,
    mouseEnter: PropTypes.func.isRequired,
    mouseLeave: PropTypes.func.isRequired,
    mouseDown: PropTypes.func.isRequired,
    mouseUp: PropTypes.func.isRequired,
};

const mapStateToProps = (state, ownProps) => {
    const paintTool = state.getIn(['realAsset', 'figuresGroup', ownProps.figureId, 'status', ownProps.statusId, 'paintTool']);
    let viewMode = paintTool.get('viewMode');
    const valueList = state.getIn(['realAsset', 'figuresGroup', ownProps.figureId, 'status', ownProps.statusId, 'value']);
    // form a valueList
    if (ownProps.row === 0 && ownProps.col === 0) {
        global = global.set('valueList', valueList);
        state.getIn(['realAsset', 'content', 'status', 'sequence']).filter((figureId, statusId) => statusId !== ownProps.statusId).forEach((figureId, statusId) => {
             state.getIn(['realAsset', 'figuresGroup', figureId, 'status', statusId, 'value']).forEach((rowList, rowIndex) => rowList.forEach((cell, colIndex) => {
                if (cell.get('hex') !== '#ededed' && valueList.getIn([rowIndex, colIndex, 'hex']) === '#ededed') {
                    global = global.setIn(['valueList', rowIndex, colIndex], Map({
                        hex: '#cccccc',
                        opacity: 1,
                    }));
                }
            }));
        });
    }
    if (viewMode === 'picker') {
        viewMode = 'brush';
    }
    // 整个画面有三个影响全局的属性，picker， cursor， region(目前不考虑cursor和region)
    // picker即颜色
    // region，cursor：选中区域以及其色彩
    // 在cursor时，点击一个区域后，即抹去上面的色块，然后新建cursor上的region，mouseUp以后更新region，点击空白区域后会更新到画板上
    return {
        hex: paintTool.getIn(['macro', 'hex']),
        region: paintTool.getIn(['macro', 'region']),
        size: Map({ height: paintTool.getIn(['cursor', 'position', 'height']), width: paintTool.getIn(['cursor', 'position', 'width']) }),
        angle: paintTool.getIn(['cursor', 'rotate', 'angle']),
        viewMode,
        valueList,
        paintToolOperation: paintTool.get(viewMode),
    };
};

const mapDispatchToProps = dispatch => ({
    mouseEnter: ({
        row, col, statusId, hex, region, valueList, paintToolOperation, viewMode, width, height, value, select,
    }) => () => {
        const rowLength = valueList.size;
        const colLength = valueList.get(0).size;
        switch (viewMode) {
            case 'brush': case 'eraser': {
                if (viewMode === 'brush' && paintToolOperation.get('cuvette') && macro.color({ region: global.get('region'), valueList, row, col }).get('hex') !== '#ededed') {
                    dispatch({
                        type: 'PAINTTOOL_BRUSH_CUVETTE_PICK',
                        opacity: macro.color({ region: global.get('region'), valueList, row, col }).get('opacity'),
                    });
                    dispatch({
                        type: 'PAINTTOOL_MACRO_COLOR',
                        hex: macro.color({ region: global.get('region'), valueList, row, col }).get('hex'),
                    });
                } else {
                    global = global.merge(brush.mouseEnter({
                        row, col, paintToolOperation, rowLength, colLength, statusId,
                        brushRegion: global.get('brushRegion'), hex, select, width, height, viewMode,
                    }));
                }
                break;
            }

            case 'cursor':
                // mouse enter到有眼色的地方会导致相同色的色块被选取得
                // 以选取到的点为中心点，看四周8个点是否为同色，选取到边缘点//选取的范围以中心点为矩形
                if (!paintToolOperation.get('select')) {
                    global = global.set('region', cursor.select({ region: global.get('region'), mode: paintToolOperation.get('mode'), row, col, width, height, statusId, valueList, value, colLength, rowLength }));
                } else if (paintToolOperation.getIn(['pick', 'trigger'])) {
                        // region和valueList的结合, 获取新的region， 写入原地图， 在写入新图画
                    global = global.set('region', cursor.pick({ paintToolOperation, row, col, valueList: global.get('valueList'), statusId, width, height, region }));
                }
                break;

            case 'region':
                if (!paintToolOperation.get('click')) {
                    regionOperation.select({ regionPreCursor: global.get('regionPreCursor'), row, col, width, height, statusId });
                } else {
                    global = global.set('region', regionOperation.pick({ startCursor: paintToolOperation.get('start'), region: global.get('region'), operation: paintToolOperation.get('viewMode'), mode: paintToolOperation.get('mode'), row, col, width, height, statusId }));
                    // region 为valueList,
                }
                global = global.set('regionPreCursor', Map({ row, col }));
                break;

            case 'bucket':
                global = global.set('region', cursor.select({ region: global.get('region'), mode: paintToolOperation.get('mode'), row, col, width, height, statusId, valueList, value, colLength, rowLength })); // 增添mode
                break;

            case 'shape':
                if (!paintToolOperation.get('click')) {
                    shape.select({ regionPreCursor: global.get('regionPreCursor'), row, col, width, height, statusId });
                } else {
                    global = global.set('region', shape.pick({ startCursor: paintToolOperation.get('start'), shapeOperation: paintToolOperation.get(paintToolOperation.get('viewMode')), region: global.get('region'), operation: paintToolOperation.get('viewMode'), row, col, width, height, statusId }));
                }
                global = global.set('regionPreCursor', Map({ row, col }));
                break;

            default:
                break;
        }
    },

    mouseLeave: ({
        statusId, height, width, viewMode, valueList, row, col,
    }) => () => {
        const rowLength = valueList.size;
        const colLength = valueList.get(0).size;
        switch (viewMode) {
            case 'brush': case 'eraser':
                brush.mouseLeave({ mouseRegion: global.get('mouseRegion'), rowLength, colLength, statusId, width, height });
                break;

            case 'cursor': case 'bucket':
                break;

            case 'region':
                regionOperation.mouseLeave({ region: global.get('region'), row, col, statusId, width, height });
                break;

            case 'shape':
                shape.mouseLeave({ region: global.get('region'), row, col, statusId, width, height });
                break;

            default:
                break;
        }
    },
    mouseDown: ({
        figureId, statusId, paintToolOperation, viewMode, row, col, hex, region,
    }) => () => {
        // 其余操作都在region中，而region操作则需要将
        if (!['cursor', 'region', 'bucket'].includes(viewMode) && global.get('region').some(rowList => rowList.some(cell => cell.get('inner')))) {
            dispatch({ // 开始将region映射到valueList中
                type: 'FIGURE_BOARD_CURSOR_SELECT_END',
                figureId,
                statusId,
                region: global.get('region'),
            }); // region中所有颜色都没有，但是inner有true和false 之分
            // 设置region
            global = global.update('region', updateRegion => updateRegion.map(rowList => rowList.map(() => Map({
                hex: '#ededed',
                opacity: 1,
                inner: false,
            }))));
            dispatch({
                type: 'PAINTTOOL_MACRO_CURSOR_SELECT_MOUSEDOWN',
                region: global.get('region'),
            }); // 设置region为无颜色
            dispatch({
                type: 'PAINTTOOL_CURSOR_SELECT_END',
            });
        }
        switch (viewMode) {
            case 'brush': case 'eraser': {
                global = global.set('brushRegion', global.get('mouseRegion'));
                dispatch({
                    type: 'FIGURE_BOARD_BRUSH',
                    figureId,
                    statusId,
                    hex: (viewMode === 'eraser' ? '#ededed' : hex),
                    opacity: (viewMode === 'eraser' ? 1 : paintToolOperation.get('opacity')),
                    viewMode,
                    mouseDown: true,
                    brushRegion: global.get('brushRegion'),
                });
                break;
            }

            case 'cursor':
                if (!global.getIn(['region', row, col, 'inner'])) { // 点到空白处
                    dispatch({
                        type: 'FIGURE_BOARD_CURSOR_SELECT_END',
                        figureId,
                        statusId,
                        region: global.get('region'),
                    });
                    dispatch({
                        type: 'PAINTTOOL_CURSOR_SELECT_END',
                    });
                    global = global.update('region', updateRegion => updateRegion.map(rowList => rowList.map(() => Map({
                        hex: '#ededed',
                        opacity: 1,
                        inner: false,
                    }))));
                    dispatch({
                        type: 'PAINTTOOL_MACRO_CURSOR_SELECT_MOUSEDOWN',
                        region: global.get('region'), // 永远是最新结果
                    }); // 设置region
                } else {
                    dispatch({
                        type: 'PAINTTOOL_CURSOR_SELECT_MOUSEDOWN',
                        pick: Map({
                            trigger: true,
                            row,
                            col,
                        }),
                    }); // 移动trigger
                    dispatch({
                        type: 'PAINTTOOL_MACRO_CURSOR_SELECT_MOUSEDOWN',
                        region: global.get('region'),
                    }); // 设置region
                    if (!global.get('region').equals(region)) {
                        dispatch({
                            type: 'FIGURE_BOARD_CURSOR_SELECT_MOUSEDOWN',
                            figureId,
                            statusId,
                            region: global.get('region'),
                        });
                    }// 第一次移动需要将Figure中选中像素清除
                }
                dispatch({
                    type: 'PAINTTOOL_CURSOR_POSITION_SIZE_RESET',
                });
                break;
            //
            case 'bucket':
                global = global.update('region', updateRegion => updateRegion.map(rowList => rowList.map((cell) => {
                    if (cell.get('inner')) {
                        cell = cell.set('hex', hex);
                        cell = cell.set('opacity', paintToolOperation.get('opacity'));
                    }
                    return cell;
                })));
                dispatch({
                    type: 'FIGURE_BOARD_CURSOR_SELECT_END',
                    figureId,
                    statusId,
                    region: global.get('region'),
                });
                global = global.update('region', updateRegion => updateRegion.map(rowList => rowList.map(() => Map({
                    hex: '#ededed',
                    opacity: 1,
                    inner: false,
                }))));
                break;
            //
            case 'region':
                dispatch({ // 开始将region映射到valueList中
                    type: 'FIGURE_BOARD_CURSOR_SELECT_END',
                    figureId,
                    statusId,
                    region: global.get('region'),
                }); // region中所有颜色都没有，但是inner有true和false 之分
                // 设置region
                global = global.setIn(['region', row, col, 'inner'], true);
                dispatch({ // 开始操作region
                    type: 'PIANTTOOL_REGION_SELECT_MOUSEDOWN',
                    figureId,
                    statusId,
                    start: Map({ row, col }),
                    click: true,
                });
                dispatch({ // 无法移动cursor选中的内容
                    type: 'PAINTTOOL_CURSOR_SELECT_MOUSEDOWN',
                    pick: Map({
                        trigger: false,
                        row,
                        col,
                    }),
                }); // 移动trigger
                break;

            case 'shape':
                dispatch({ // 开始操作region
                    type: 'PIANTTOOL_SHAPE_SELECT_MOUSEDOWN',
                    figureId,
                    statusId,
                    start: Map({ row, col }),
                    click: true,
                });
                dispatch({
                    type: 'PAINTTOOL_CURSOR_SELECT_MOUSEDOWN',
                    pick: Map({
                        trigger: false,
                        row,
                        col,
                    }),
                }); // 移动trigger
                break;

            default:
                break;
        }
    },
    mouseUp: ({
        viewMode, paintToolOperation, figureId, statusId, hex, valueList,
    }) => () => {
        switch (viewMode) {
            case 'brush': case 'eraser':
                dispatch({
                    type: 'FIGURE_BOARD_BRUSH',
                    figureId,
                    statusId,
                    hex: (viewMode === 'eraser' ? '#ededed' : hex),
                    opacity: (viewMode === 'eraser' ? 1 : paintToolOperation.get('opacity')),
                    viewMode,
                    mouseDown: false,
                    brushRegion: global.get('brushRegion'),
                });
                dispatch({
                    type: 'PAINTTOOL_MACRO_CURSOR_SELECT_MOUSEDOWN',
                    region: global.get('region'),
                }); // 设置region
                break;

            case 'cursor':
                if (paintToolOperation.getIn(['pick', 'trigger'])) {
                    dispatch({
                        type: 'PAINTTOOL_CURSOR_SELECT_MOUSEUP',
                    });
                    dispatch({
                        type: 'PAINTTOOL_MACRO_CURSOR_SELECT_MOUSEDOWN',
                        region: global.get('region'),
                    }); // 设置region
                }

                break;

            case 'region':
                dispatch({
                    type: 'PIANTTOOL_REGION_SELECT_MOUSEDOWN',
                    figureId,
                    statusId,
                    start: Map({ row: 0, col: 0 }),
                    click: false,
                });
                // 将region从valueList中提取出来
                global = global.update('region', region => region.map((rowList, rowIndex) => rowList.map((cell, colIndex) => {
                    if (cell.get('inner')) {
                        cell = cell.set('hex', valueList.getIn([rowIndex, colIndex, 'hex']));
                        return cell.set('opacity', valueList.getIn([rowIndex, colIndex, 'opacity']));
                    }
                    return cell;
                })));
                dispatch({
                    type: 'FIGURE_BOARD_CURSOR_SELECT_MOUSEDOWN',
                    figureId,
                    statusId,
                    region: global.get('region'),
                }); // 将valueList去除
                dispatch({
                    type: 'PAINTTOOL_MACRO_CURSOR_SELECT_MOUSEDOWN',
                    region: global.get('region'),
                }); // 设置region
                break;

            case 'shape':
                dispatch({
                    type: 'PIANTTOOL_SHAPE_SELECT_MOUSEDOWN',
                    figureId,
                    statusId,
                    start: Map({ row: 0, col: 0 }),
                    click: false,
                });
                dispatch({
                    type: 'PAINTTOOL_MACRO_CURSOR_SELECT_MOUSEDOWN',
                    region: global.get('region'),
                }); // 设置region
                break;

            default:
                break;
        }
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(Cell);

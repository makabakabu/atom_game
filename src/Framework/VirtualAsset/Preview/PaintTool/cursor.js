import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { InputNumber } from 'antd';
import TabBar from 'Asset/Component/PaintTool/tabBar';
import Position from 'Asset/Component/PaintTool/position';

let angle = 0;
const Cursor = ({
    cursor, flipSelect, onRotate, rotateOperation,
    operationMouseDown, operationMouseUp, positionChangeViewMode, bracketSelect, selectMode,
}) => (
    <div style={styles.main}>
        <TabBar name="选择" color="#ccc" />
        <div style={{ width: 200, height: 30, marginTop: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            模式：
            <div style={{ width: '80%', display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
                <img style={{ width: 25, height: 25 }} src={require(`Asset/Image/PaintTool/Cursor/outline${cursor.get('mode') === 'outline' ? '_selected' : ''}.png`)} onClick={selectMode({ mode: 'outline' })} alt="轮廓" role="presentation" />
                <img style={{ width: 25, height: 25 }} src={require(`Asset/Image/PaintTool/Cursor/singleColor${cursor.get('mode') === 'singleColor' ? '_selected' : ''}.png`)} onClick={selectMode({ mode: 'singleColor' })} alt="单色" role="presentation" />
            </div>
        </div>
        <div style={{ width: 200, height: 100, marginTop: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            { cursor.getIn(['position', 'viewMode']) === 'location' ? '位置: ' : '尺寸: ' }
            <div style={{ width: '80%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Position viewMode={cursor.getIn(['position', 'viewMode'])} bracket={cursor.getIn(['position', 'bracket'])} operationMouseDown={operationMouseDown} operationMouseUp={operationMouseUp} positionChangeViewMode={positionChangeViewMode} bracketSelect={bracketSelect} />
            </div>
        </div>
        <div style={styles.rotate}>
            <div> 旋转: </div>
            <div style={{ width: 100, display: 'flex', justifyContent: 'space-between' }}>
                <img
                  id="rotateImage"
                  draggable="false"
                  style={{ ...styles.rotateImg, transform: `rotate(${cursor.getIn(['rotate', 'angle'])}deg)` }}
                  src={require('Asset/Image/PaintTool/Cursor/rotate.png')}
                  alt="旋转图片"
                  onMouseDown={rotateOperation}
                  role="presentation"
                />
                <InputNumber id="rotateInput" size="small" value={cursor.getIn(['rotate', 'angle'])} onChange={value => onRotate({ value })} style={{ width: 60 }} />
            </div>
            <img
              role="presentation"
              alt="垂直翻转"
              draggable="false"
              style={styles.flipHorizontal}
              src={require(`Asset/Image/PaintTool/Cursor/${cursor.getIn(['rotate', 'flip']) === 'vertical' ? 'flip_selected' : 'flip'}.png`)}
              onMouseDown={flipSelect({ direction: 'vertical' })}
              onMouseUp={flipSelect({ direction: '' })}
            />
            <img
              role="presentation"
              alt="水平翻转"
              draggable="false"
              style={styles.flipVertical}
              src={require(`Asset/Image/PaintTool/Cursor/${cursor.getIn(['rotate', 'flip']) === 'horizontal' ? 'flip_selected' : 'flip'}.png`)}
              onMouseDown={flipSelect({ direction: 'horizontal' })}
              onMouseUp={flipSelect({ direction: '' })}
            />
        </div>
    </div>
);

Cursor.propTypes = {
    cursor: ImmutablePropTypes.map.isRequired,
    selectMode: PropTypes.func.isRequired,
    flipSelect: PropTypes.func.isRequired,
    onRotate: PropTypes.func.isRequired,
    rotateOperation: PropTypes.func.isRequired,
    operationMouseDown: PropTypes.func.isRequired,
    operationMouseUp: PropTypes.func.isRequired,
    positionChangeViewMode: PropTypes.func.isRequired,
    bracketSelect: PropTypes.func.isRequired,
};

const styles = {
    main: {
        width: '90%',
        fontSize: 13,
        color: '#aaa',
    },
    rotate: {
        height: 50,
        width: '100%',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    rotateImg: {
        width: 23,
        height: 23,
        cursor: 'pointer',
    },
    flipHorizontal: {
        width: 20,
        cursor: 'pointer',
        marginLeft: 15,
    },
    flipVertical: {
        width: 20,
        transform: 'rotate(90deg)',
        cursor: 'pointer',
    },
    input: {
        border: 'none',
        borderRadius: 2,
        boxShadow: '0 0 4px rgba(250, 0, 0, 0.5)',
        margin: 2,
        width: 30,
        height: 15,
        fontSize: 12,
        textAlign: 'center',
        color: '#aaa',
        transition: 'all 0.3s ease-out',
    },
};

const mapStateToProps = (state, ownProps) => ({
    cursor: ownProps.paintToolOperation,
});

const mapDispatchToProps = (dispatch) => {
    const mouseupListener = () => {
        dispatch({
            type: 'VIRTUALASSET_PAINTTOOL_CURSOR_ROTATE_ANGLE',
            angle: Math.floor(angle),
        });
        document.removeEventListener('mouseup', mouseupListener, true);
        document.removeEventListener('mousemove', rotateMove, true);
    };
    const rotateMove = (event) => {
        const left = (event.clientX + document.documentElement.scrollLeft) - document.getElementById('rotateImage').offsetLeft - (document.getElementById('rotateImage').offsetWidth / 2);
        const top = (event.clientY + document.documentElement.scrollTop) - document.getElementById('rotateImage').offsetTop - (document.getElementById('rotateImage').offsetHeight / 2);
        angle = Math.atan(top / left) * (180 / Math.PI);
        if (top > 0) {
            if (left <= 0) {
                angle += 180;
            }
        } else {
            angle = (left > 0) ? 360 + angle : 180 + angle;
        }
        document.getElementById('rotateImage').style.transform = `rotate(${angle}deg)`;
        document.getElementById('rotateInput').value = Math.floor(angle);
    };
    return {
        operationMouseDown: ({ viewMode, bracket, direction }) => async () => {
            // 如果是location没有
            document.getElementById(`${viewMode + direction.substr(0, 1).toUpperCase() + direction.substr(1)}Circle`).style.color = '#ccc';
            if (viewMode === 'location') {
                switch (direction) {
                    case 'top':
                        document.getElementById(`${viewMode + direction.substr(0, 1).toUpperCase() + direction.substr(1)}Bracket`).style.marginTop = '25%';
                        break;

                    case 'left':
                        document.getElementById(`${viewMode + direction.substr(0, 1).toUpperCase() + direction.substr(1)}Bracket`).style.marginLeft = '20%';
                        break;

                    case 'right':
                        document.getElementById(`${viewMode + direction.substr(0, 1).toUpperCase() + direction.substr(1)}Bracket`).style.marginLeft = '60%';
                        break;

                    case 'bottom':
                        document.getElementById(`${viewMode + direction.substr(0, 1).toUpperCase() + direction.substr(1)}Bracket`).style.marginTop = '30%';
                        break;

                    default:
                        break;
                }
                dispatch({
                    type: 'VIRTUALASSET_PAINTTOOL_MACRO_CURSOR_POSITION_LOCATION_CHNAGE_VALUE',
                    direction,
                });
            } else {
                switch (direction) {
                    case 'top':
                        bracket = (bracket !== 'top' && bracket !== 'bottom') ? 'top' : bracket;
                        document.getElementById(`${viewMode + bracket.substr(0, 1).toUpperCase() + bracket.substr(1)}Bracket`).style.marginTop = bracket === 'top' ? '0%' : '-13%';
                        break;

                    case 'left':
                        bracket = (bracket !== 'left' && bracket !== 'right') ? 'left' : bracket;
                        document.getElementById(`${viewMode + bracket.substr(0, 1).toUpperCase() + bracket.substr(1)}Bracket`).style.marginLeft = bracket === 'left' ? '20%' : '-60%';
                        break;

                    case 'right':
                        bracket = (bracket !== 'left' && bracket !== 'right') ? 'right' : bracket;
                        document.getElementById(`${viewMode + bracket.substr(0, 1).toUpperCase() + bracket.substr(1)}Bracket`).style.marginLeft = bracket === 'right' ? '70%' : '120%';
                        break;

                    case 'bottom':
                        bracket = (bracket !== 'top' && bracket !== 'bottom') ? 'bottom' : bracket;
                        document.getElementById(`${viewMode + bracket.substr(0, 1).toUpperCase() + bracket.substr(1)}Bracket`).style.marginTop = bracket === 'bottom' ? '13%' : '24%';
                        break;

                    default:
                        break;
                }
                if (bracket === 'top' || bracket === 'left') {
                    dispatch({
                        type: 'VIRTUALASSET_PAINTTOOL_MACRO_CURSOR_POSITION_LOCATION_CHNAGE_VALUE',
                        direction,
                    });
                }
                dispatch({
                    type: 'VIRTUALASSET_PAINTTOOL_CURSOR_POSITION_SIZE_CHNAGE_VALUE',
                    direction,
                    bracket,
                });
            }
        },
        operationMouseUp: ({ viewMode, bracket, direction }) => () => {
            document.getElementById(`${viewMode + direction.substr(0, 1).toUpperCase() + direction.substr(1)}Circle`).style.color = '#aaa';
            if (viewMode === 'location') {
                switch (direction) {
                    case 'top':
                        document.getElementById(`${viewMode + direction.substr(0, 1).toUpperCase() + direction.substr(1)}Bracket`).style.marginTop = '45%';
                        break;

                    case 'left':
                        document.getElementById(`${viewMode + direction.substr(0, 1).toUpperCase() + direction.substr(1)}Bracket`).style.marginLeft = '70%';
                        break;

                    case 'right':
                        document.getElementById(`${viewMode + direction.substr(0, 1).toUpperCase() + direction.substr(1)}Bracket`).style.marginLeft = '5%';
                        break;

                    case 'bottom':
                        document.getElementById(`${viewMode + direction.substr(0, 1).toUpperCase() + direction.substr(1)}Bracket`).style.marginTop = '10%';
                        break;

                    default:
                        break;
                }
            } else {
                switch (bracket) {
                    case 'top':
                        document.getElementById(`${viewMode + bracket.substr(0, 1).toUpperCase() + bracket.substr(1)}Bracket`).style.marginTop = '12%';
                        break;

                    case 'left':
                        document.getElementById(`${viewMode + bracket.substr(0, 1).toUpperCase() + bracket.substr(1)}Bracket`).style.marginLeft = '70%';
                        break;

                    case 'right':
                        document.getElementById(`${viewMode + bracket.substr(0, 1).toUpperCase() + bracket.substr(1)}Bracket`).style.marginLeft = '5%';
                        break;

                    case 'bottom':
                        document.getElementById(`${viewMode + bracket.substr(0, 1).toUpperCase() + bracket.substr(1)}Bracket`).style.marginTop = '0%';
                        break;

                    default:
                        break;
                }
            }
        },
        positionChangeViewMode: ({ viewMode }) => () => {
            dispatch({
                type: 'VIRTUALASSET_PAINTTOOL_CURSOR_CHANGE_POSITION_VIEWMODE',
                viewMode,
            });
        },
        bracketSelect: ({ bracket }) => () => {
            dispatch({
                type: 'VIRTUALASSET_PAINTTOOL_CURSOR_CHANGE_POSTION_BRACKET',
                bracket,
            });
        },
        selectMode: ({ mode }) => () => {
            dispatch({
                type: 'VIRTUALASSET_PAINTTOOL_CURSOR_MODE',
                mode,
            });
        },
        flipSelect: ({ direction }) => () => {
            dispatch({
                type: 'VIRTUALASSET_PAINTTOOL_CURSOR_FLIP_SELECT',
                direction,
            });
            dispatch({
                type: 'VIRTUALASSET_PAINTTOOL_MACRO_CURSOR_FLIP_SELECT',
                direction,
            });
        },
        onRotate: ({ value }) => {
            dispatch({
                type: 'VIRTUALASSET_PAINTTOOL_CURSOR_ROTATE_ANGLE',
                angle: value,
            });
        },
        rotateOperation: () => {
            document.addEventListener('mouseup', mouseupListener, true);
            document.addEventListener('mousemove', rotateMove, true);
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Cursor);

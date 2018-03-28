import React from 'react';
import { Map } from 'immutable';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import uuidv4 from 'uuid';
import Draggable from 'react-draggable';

// 1. 判断width， height应有的长度
// 整体的scale，和frame个体的scale

let start = Map({ x: 0, y: 0 });
const Board = ({ frame, frameId, isFocused, value, color, scale, startDrag, stopDrag, resize, rotateOperation }) => (
    <Draggable
      grid={[4.8 * scale * frame.getIn(['functionPanel', 'shrink']), 4.8 * scale * frame.getIn(['functionPanel', 'shrink'])]}
      position={{ x: frame.getIn(['functionPanel', 'position', 'x']) * 4.8 * scale * frame.getIn(['functionPanel', 'shrink']), y: -frame.getIn(['functionPanel', 'position', 'y']) * 4.8 * scale * frame.getIn(['functionPanel', 'shrink']) }}
      onStart={(event, data) => startDrag({ event, data })}
      onStop={(_, data) => stopDrag({ data, unitLength: 4.8 * scale * frame.getIn(['functionPanel', 'shrink']) })}
      ref={(drag) => { this.drag = drag; }}
    >
        <span>
            <div
              id={`${frameId}ContentBoard`}
              style={{ ...styles.main, boxShadow: isFocused && '0 2px 8px #aaa', height: 4.8 * value.size * scale * frame.getIn(['functionPanel', 'shrink']), width: 4.8 * value.get(0).size * scale * frame.getIn(['functionPanel', 'shrink']),
                    zIndex: isFocused ? 1 : 0, transform: `rotate(${frame.getIn(['functionPanel', 'angle'])}deg)`, cursor: 'move' }}
              onWheel={event => resize({ event, value: frame.getIn(['functionPanel', 'shrink']) })}
            >
                {
                    isFocused &&
                    <div
                      style={{ position: 'absolute', top: 0, right: 0, width: 10, height: 10, display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: '-webkit-grab' }}
                      onMouseDown={event => rotateOperation({ event })}
                      role="presentation"
                    >
                        <div style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: '#6a6a6a' }} />
                    </div>
                }
                {
                    value.map((rowList, rowIndex) => rowList.map((cell, colIndex) => (<div
                      key={uuidv4()}
                      id={`animateBoard${rowIndex}_${colIndex}`}
                      style={{
                        backgroundColor: color({ cell, isFocused }),
                        width: `${100 / value.get(0).size}%`,
                        height: `${100 / value.size}%`,
                      }}
                    />)))
                }
            </div>
        </span>
    </Draggable>
);

Board.propTypes = {
    frame: ImmutablePropTypes.map.isRequired,
    frameId: PropTypes.string.isRequired,
    value: ImmutablePropTypes.list.isRequired,
    isFocused: PropTypes.bool.isRequired,
    color: PropTypes.func.isRequired,
    scale: PropTypes.number.isRequired,
    startDrag: PropTypes.func.isRequired,
    stopDrag: PropTypes.func.isRequired,
    resize: PropTypes.func.isRequired,
    rotateOperation: PropTypes.func.isRequired,
};

const styles = {
    main: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexWrap: 'wrap',
    },
};

const mapStateToProps = (state, ownProps) => {
    const focusedAnimate = state.getIn(['realAsset', 'content', 'animate', 'focusedAnimate']);
    const frame = state.getIn(['realAsset', 'figuresGroup', focusedAnimate.get('figureId'), 'animate', focusedAnimate.get('animateId'), 'frameSequence', ownProps.frameId]);
    return {
        frame,
        value: state.getIn(['realAsset', 'figuresGroup', frame.get('figureId'), 'status', frame.get('statusId'), 'value']),
        isFocused: state.getIn(['realAsset', 'figuresGroup', focusedAnimate.get('figureId'), 'animate', focusedAnimate.get('animateId'), 'focusedFrame']).includes(ownProps.frameId),
        scale: state.getIn(['realAsset', 'figuresGroup', focusedAnimate.get('figureId'), 'animate', focusedAnimate.get('animateId'), 'scale']),
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    const mouseupListener = () => {
        document.removeEventListener('mouseup', mouseupListener, true);
        document.removeEventListener('mousemove', rotateMove, true);
        document.documentElement.style.cursor = 'default';
        document.getElementById(`${ownProps.frameId}ContentBoard`).style.cursor = 'move';
    };
    const rotateMove = (event) => {
        const left = (event.clientX + document.documentElement.scrollLeft) - document.getElementById('animateBoard').offsetLeft - this.drag.state.x - (document.getElementById(`${ownProps.frameId}ContentBoard`).offsetWidth / 2);
        const top = (event.clientY + document.documentElement.scrollTop) - ((document.getElementById('animateBoard').offsetTop + document.getElementById('animateBoard').offsetHeight + this.drag.state.y) - (document.getElementById(`${ownProps.frameId}ContentBoard`).offsetHeight / 2));
        let angle = (Math.atan(top / left) + Math.atan(document.getElementById(`${ownProps.frameId}ContentBoard`).offsetHeight / document.getElementById(`${ownProps.frameId}ContentBoard`).offsetWidth)) * (180 / Math.PI);
        if (top > 0) {
            if (left <= 0) {
                angle += 180;
            }
        } else {
            angle = (left > 0) ? 360 + angle : 180 + angle;
        }
        dispatch({
            type: 'ANIMATE_BOARD_FUNCTIONPANEL_SETTING_OPERATION',
            frameId: ownProps.frameId,
            operationKind: ['angle'],
            value: Math.floor(angle),
        });
    };
    return {
        color: ({ cell, isFocused }) => {
            if (cell.get('hex') === '#ededed') {
                return 'transparent';
            }
            if (isFocused) {
                return `rgba(${parseInt(cell.get('hex').substr(1, 2), 16)},${parseInt(cell.get('hex').substr(3, 2), 16)},${parseInt(cell.get('hex').substr(5, 2), 16)},${cell.get('opacity')})`;
            }
            return '#ccc';
        },
        startDrag: ({ event, data }) => {
            document.getElementById(`${ownProps.frameId}ContentBoard`).style.cursor = 'move';
            start = Map({
                x: data.x,
                y: data.y,
            });
            dispatch({
                type: 'FOCUS_FRAME',
                frameId: ownProps.frameId,
                shift: true,
            });
            event.preventDefault();
            event.stopPropagation();
        },
        stopDrag: ({ data, unitLength }) =>
            dispatch({
                type: 'ANIMATE_CONTENT_DRAG',
                deltaX: Math.round((data.lastX - start.get('x')) / unitLength),
                deltaY: -Math.round((data.lastY - start.get('y')) / unitLength),
            }),
        rotateOperation: ({ event }) => {
            document.addEventListener('mouseup', mouseupListener, true);
            document.addEventListener('mousemove', rotateMove, true);
            document.documentElement.style.cursor = '-webkit-grabbing';
            document.getElementById(`${ownProps.frameId}ContentBoard`).style.cursor = '-webkit-grabbing';
            event.preventDefault();
            event.stopPropagation();
        },
        change: ({ value, operationKind }) =>
            dispatch({
                type: 'ANIMATE_BOARD_FUNCTIONPANEL_SETTING_OPERATION',
                frameId: ownProps.frameId,
                operationKind,
                value,
            }),
        resize: ({ event, value }) => {
            if (event.deltaY > 0) {
                document.getElementById(`${ownProps.frameId}ContentBoard`).style.cursor = '-webkit-zoom-in';
                dispatch({
                    type: 'ANIMATE_BOARD_FUNCTIONPANEL_SETTING_OPERATION',
                    frameId: ownProps.frameId,
                    operationKind: ['shrink'],
                    value: value + 0.05,
                });
            } else {
                document.getElementById(`${ownProps.frameId}ContentBoard`).style.cursor = '-webkit-zoom-out';
                dispatch({
                    type: 'ANIMATE_BOARD_FUNCTIONPANEL_SETTING_OPERATION',
                    frameId: ownProps.frameId,
                    operationKind: ['shrink'],
                    value: value - 0.05,
                });
            }
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Board);

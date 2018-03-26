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
const Board = ({ frame, isFocused, value, color, scale, startDrag, stopDrag }) => (
    <Draggable
      grid={[4.8 * scale * frame.getIn(['functionPanel', 'shrink']), 4.8 * scale * frame.getIn(['functionPanel', 'shrink'])]}
      position={{ x: frame.getIn(['functionPanel', 'position', 'x']) * 4.8 * scale * frame.getIn(['functionPanel', 'shrink']), y: -frame.getIn(['functionPanel', 'position', 'y']) * 4.8 * scale * frame.getIn(['functionPanel', 'shrink']) }}
      onStart={(_, data) => startDrag({ data })}
      onStop={(_, data) => stopDrag({ data, unitLength: 4.8 * scale * frame.getIn(['functionPanel', 'shrink']) })}
    >
        <span>
            <div style={{ ...styles.main, boxShadow: isFocused && '0 2px 8px #aaa', height: 4.8 * value.size * scale * frame.getIn(['functionPanel', 'shrink']), width: 4.8 * value.get(0).size * scale * frame.getIn(['functionPanel', 'shrink']),
                    zIndex: isFocused ? 1 : 0, transform: `rotate(${frame.getIn(['functionPanel', 'angle'])}deg)`, position: 'relative' }}
            >
                <div style={{ position: 'absolute', top: 0, left: 0, width: 10, height: 10, display: 'flex', justifyContent: 'center', alignItems: 'center' }} >
                    <div style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: '#6a6a6a' }} />
                </div>
                <div style={{ position: 'absolute', top: 0, right: 0, width: 10, height: 10, display: 'flex', justifyContent: 'center', alignItems: 'center' }} >
                    <div style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: '#6a6a6a' }} />
                </div>
                <div style={{ position: 'absolute', bottom: 0, left: 0, width: 10, height: 10, display: 'flex', justifyContent: 'center', alignItems: 'center' }} >
                    <div style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: '#6a6a6a' }} />
                </div>
                <div style={{ position: 'absolute', bottom: 0, right: 0, width: 10, height: 10, display: 'flex', justifyContent: 'center', alignItems: 'center' }} >
                    <div style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: '#6a6a6a' }} />
                </div>
                <div style={{ position: 'absolute', top: 0, left: 0, width: 10, height: 10, display: 'flex', justifyContent: 'center', alignItems: 'center' }} >
                    <div style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: '#6a6a6a' }} />
                </div>
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
    value: ImmutablePropTypes.list.isRequired,
    isFocused: PropTypes.bool.isRequired,
    color: PropTypes.func.isRequired,
    scale: PropTypes.number.isRequired,
    startDrag: PropTypes.func.isRequired,
    stopDrag: PropTypes.func.isRequired,
};

const styles = {
    main: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexWrap: 'wrap',
        position: 'absolute',
        left: 0,
        bottom: 0,
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

const mapDispatchToProps = (dispatch, ownProps) => ({
    color: ({ cell, isFocused }) => {
        if (cell.get('hex') === '#ededed') {
            return 'transparent';
        }
        if (isFocused) {
            return `rgba(${parseInt(cell.get('hex').substr(1, 2), 16)},${parseInt(cell.get('hex').substr(3, 2), 16)},${parseInt(cell.get('hex').substr(5, 2), 16)},${cell.get('opacity')})`;
        }
        return '#ccc';
    },
    startDrag: ({ data }) => {
        start = Map({
            x: data.x,
            y: data.y,
        });
        dispatch({
            type: 'FOCUS_FRAME',
            frameId: ownProps.frameId,
            shift: false,
        });
    },
    stopDrag: ({ data, unitLength }) =>
        dispatch({
            type: 'ANIMATE_CONTENT_DRAG',
            deltaX: Math.round((data.lastX - start.get('x')) / unitLength),
            deltaY: -Math.round((data.lastY - start.get('y')) / unitLength),
        }),
});

export default connect(mapStateToProps, mapDispatchToProps)(Board);

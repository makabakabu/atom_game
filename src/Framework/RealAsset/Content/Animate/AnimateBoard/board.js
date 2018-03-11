import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import uuidv4 from 'uuid';

// 1. 判断width， height应有的长度
// 整体的scale，和frame个体的scale

const Board = ({ frame, value, isFocused, color }) => (
    <div
      style={{ height: `${4.8 * value.size}px`, width: `${4.8 * value.get(0).size}px`, display: 'flex', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap', position: 'absolute', left: 0, bottom: 0, zIndex: isFocused ? 1 : 0, transform: `rotate(${frame.getIn(['functionPanel', 'angle'])}deg) scale(${frame.getIn(['functionPanel', 'shrink'])}, ${frame.getIn(['functionPanel', 'shrink'])}) translate(${frame.getIn(['functionPanel', 'position', 'x']) * 4.8}px, -${frame.getIn(['functionPanel', 'position', 'y']) * 4.8}px)` }}
    >
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
);

Board.propTypes = {
    frame: ImmutablePropTypes.map.isRequired,
    value: ImmutablePropTypes.list.isRequired,
    isFocused: PropTypes.bool.isRequired,
    color: PropTypes.func.isRequired,
};

const mapStateToProps = (state, ownProps) => ({
    value: state.getIn(['realAsset', 'figuresGroup', ownProps.frame.get('figureId'), 'status', ownProps.frame.get('statusId'), 'value']),
});

const mapDispatchToProps = () => ({
    color: ({ cell, isFocused }) => {
        if (cell.get('hex') === '#ededed') {
            return 'transparent';
        }
        if (isFocused) {
            return `rgba(${parseInt(cell.get('hex').substr(1, 2), 16)},${parseInt(cell.get('hex').substr(3, 2), 16)},${parseInt(cell.get('hex').substr(5, 2), 16)},${cell.get('opacity')})`;
        }
        return '#ccc';
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(Board);

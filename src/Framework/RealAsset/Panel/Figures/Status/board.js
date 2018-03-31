import React from 'react';
import { connect } from 'react-redux';
import ImmutablePropTypes from 'react-immutable-proptypes';

// 如果focusedStatus则有border
const Board = ({ value }) => (
    <div style={{ width: 100, height: 80, display: 'flex', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap', boxShadow: '0px 1px 10px #707070' }}>
    {
        value.map((rowList, rowIndex) => rowList.map((cell, colIndex) => <div style={{ backgroundColor: cell.get('hex'), width: `${100 / rowList.size}px`, height: `${75 / value.size}px` }} key={`figureFrame${rowIndex}_${colIndex}`} id={`figureFrame${rowIndex}_${colIndex}`} />))
    }
    </div>
);

Board.propTypes = {
    value: ImmutablePropTypes.list.isRequired,
};

const mapStateToProps = (state, ownProps) => ({
    value: state.getIn(['realAsset', 'figuresGroup', ownProps.figureId, 'status', ownProps.statusId, 'value']),
});

export default connect(mapStateToProps)(Board);

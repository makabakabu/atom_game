import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

const Board = ({ isFocused, figure, focus }) => (
    <div style={{ width: 102, height: 102 }} onClick={focus} role="presentation">
        <div style={{ width: 102, height: 77, display: 'flex', flexWrap: 'wrap', margin: 4, border: `1px solid ${isFocused ? 'black' : 'transparent'}` }} role="presentation">
            {
                figure.get('status').first().get('value').map((rowList, rowIndex) => rowList.map((cell, colIndex) => <div style={{ backgroundColor: cell.get('hex'), width: 100 / rowList.size, height: 75 / figure.get('status').first().get('value').size }} key={`figureFrame${rowIndex}_${colIndex}`} id={`figureFrame${rowIndex}_${colIndex}`} />))
            }
        </div>
        <div style={{ width: 100, display: 'flex', justifyContent: 'center', fontWeight: 'bold' }}>
            { figure.get('status').first().get('name') }
        </div>
    </div>
);

Board.propTypes = {
    figure: ImmutablePropTypes.map.isRequired,
    focus: PropTypes.func.isRequired,
    isFocused: PropTypes.bool.isRequired,
};

const mapStateToProps = (state, ownProps) => ({
    isFocused: ownProps.figure.equals(state.getIn(['store', 'realAsset', 'focus'])),
});

const mapDispatchToProps = (dispatch, ownProps) => ({
    focus: () => {
        dispatch({
            type: 'STORE_FOCUS',
            kind: 'realAsset',
            value: ownProps.figure,
        });
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(Board);

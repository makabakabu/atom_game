import React from 'react';
import { connect } from 'react-redux';
import ImmutablePropTypes from 'react-immutable-proptypes';
import PropTypes from 'prop-types';

// 如果focusedStatus则有border
const Board = ({ statusId, value, name, isFocused, deleteEnterLeave, statusSequenceDelete, click }) => (
    <div style={styles.main}>
        <div id={`${statusId}FigureBoardDelete`} style={styles.delete} onMouseEnter={deleteEnterLeave({ id: `${statusId}FigureBoardDelete`, type: 'enter' })} onMouseLeave={deleteEnterLeave({ id: `${statusId}FigureBoardDelete`, type: 'leave' })} onClick={statusSequenceDelete} role="presentation"> ✖︎ </div>
        <div style={{ width: 100, height: 75, display: 'flex', flexWrap: 'wrap', boxShadow: `0 0 ${isFocused ? 8 : 0}px rgba(0, 0, 0, 0.5)`, margin: 4 }} onClick={click} role="presentation">
        {
            value.map((rowList, rowIndex) => rowList.map((cell, colIndex) => <div style={{ backgroundColor: cell.get('hex'), width: `${100 / rowList.size}px`, height: `${75 / value.size}px` }} key={`figureFrame${rowIndex}_${colIndex}`} id={`figureFrame${rowIndex}_${colIndex}`} />))
        }
        </div>
        <div style={{ width: 100, display: 'flex', justifyContent: 'center', fontWeight: 'bold' }}>
            { name }
        </div>
    </div>
);

Board.propTypes = {
    statusId: PropTypes.string.isRequired,
    value: ImmutablePropTypes.list.isRequired,
    name: PropTypes.string.isRequired,
    isFocused: PropTypes.bool.isRequired,
    deleteEnterLeave: PropTypes.func.isRequired,
    statusSequenceDelete: PropTypes.func.isRequired,
    click: PropTypes.func.isRequired,
};

const styles = {
    main: {
        width: 110,
        marginTop: 20,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: 12,
        color: '#6a6a6a',
        transition: 'all 0.4s ease-in-out',
    },
    delete: {
        width: 16,
        height: 16,
        borderRadius: 8,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        top: 10,
        backgroundColor: '#aaa',
        cursor: 'pointer',
    },
};

const mapStateToProps = (state, ownProps) => ({
    value: state.getIn(['realAsset', 'figuresGroup', ownProps.figureId, 'status', ownProps.statusId, 'value']),
    name: state.getIn(['realAsset', 'figuresGroup', ownProps.figureId, 'status', ownProps.statusId, 'name']),
    isFocused: state.getIn(['realAsset', 'content', 'status', 'focusedStatus', 'statusId']) === ownProps.statusId,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
    click: () => {
        dispatch({
            type: 'FOCUS_STATUS',
            figureId: ownProps.figureId,
            statusId: ownProps.statusId,
        });
    },
    deleteEnterLeave: ({ id, type }) => () => {
        document.getElementById(id).style.backgroundColor = type === 'enter' ? '#6a6a6a' : '#aaa';
        document.getElementById(id).style.color = type === 'enter' ? '#aaa' : '#6a6a6a';
    },
    statusSequenceDelete: () =>
        dispatch({
            type: 'STATUS_SEQUENCE_DELETE',
            statusId: ownProps.statusId,
        }),
});

export default connect(mapStateToProps, mapDispatchToProps)(Board);

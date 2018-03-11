import React from 'react';
import { connect } from 'react-redux';
import ImmutablePropTypes from 'react-immutable-proptypes';
import Board from './Board/board';

const Status = ({ focusedStatus }) => (
    <div id="figureContent" style={styles.main} >
        {
            focusedStatus.get('statusId') !== '' && <Board key={`${focusedStatus.get('statusId')}content`} statusId={focusedStatus.get('statusId')} figureId={focusedStatus.get('figureId')} />
        }
    </div>
);

Status.propTypes = {
    focusedStatus: ImmutablePropTypes.map.isRequired,
};

const styles = {
    main: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
    },
};

const mapStateToProps = state => ({
    focusedStatus: state.getIn(['realAsset', 'content', 'status', 'focusedStatus']),
});

export default connect(mapStateToProps)(Status);

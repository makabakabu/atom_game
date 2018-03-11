import React from 'react';
import { List } from 'immutable';
import { connect } from 'react-redux';
import ImmutablePropTypes from 'react-immutable-proptypes';
import PropTypes from 'prop-types';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import Board from './board';

const CompareStatus = ({ statusSequence, panelSort }) => (
    <div style={styles.main}>
        <SortableList statusSequence={statusSequence} items={List(statusSequence.keySeq())} onSortEnd={({ oldIndex, newIndex }) => panelSort({ oldIndex, newIndex })} pressDelay={200} transitionDuration={100} axis="xy" lockAxis="x" />
    </div>
);

CompareStatus.propTypes = {
    statusSequence: ImmutablePropTypes.orderedMap.isRequired,
    panelSort: PropTypes.func.isRequired,
};

const SortableList = SortableContainer(({ statusSequence, items }) => (
    <div style={styles.main}>
        {
            items.map((statusId, index) => (
                <SortableItem key={statusId + index} index={index} figureId={statusSequence.get(statusId)} statusId={statusId} />
            ))
        }
    </div>
));

const SortableItem = SortableElement(({ figureId, statusId }) =>
    <Board key={`${statusId}figureBoard`} figureId={figureId} statusId={statusId} />);

const styles = {
    main: {
        width: '100%',
        height: '150px',
        display: 'flex',
        justifyContent: 'flex-start',
        flexWrap: 'wrap',
    },
};

const mapStateToProps = state => ({
    statusSequence: state.getIn(['realAsset', 'content', 'status', 'sequence']),
});

const mapDispatchToProps = dispatch => ({
    panelSort: ({ oldIndex, newIndex }) =>
        dispatch({
            type: 'STATUS_SEQUENCE_REORDER',
            oldIndex,
            newIndex,
        }),
});

export default connect(mapStateToProps, mapDispatchToProps)(CompareStatus);

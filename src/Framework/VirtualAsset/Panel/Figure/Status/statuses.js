import React from 'react';
import { connect } from 'react-redux';
import { List } from 'immutable';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import Status from './status';

const Statuses = ({ figureId, visibility, statusIdList, panelSort }) => (
    <div
      id={`${figureId}virtualAsset_statuses`}
      style={{ width: '100%', transition: 'height 0.4s ease-out',
        height: visibility ? statusIdList.size * 35 : 0, overflow: 'hidden' }}
    >
        <SortableList figureId={figureId} items={statusIdList} onSortEnd={({ oldIndex, newIndex }) => panelSort({ figureId, oldIndex, newIndex })} pressDelay={200} transitionDuration={100} />
    </div>
);

Statuses.propTypes = {
    figureId: PropTypes.string.isRequired,
    visibility: PropTypes.bool.isRequired,
    statusIdList: ImmutablePropTypes.list.isRequired,
    panelSort: PropTypes.func.isRequired,
};

const SortableList = SortableContainer(({ figureId, items }) => (
    <div>
        {
            items.map((statusId, index) => (
                <SortableItem key={statusId + index} index={index} figureId={figureId} statusId={statusId} />
            ))
        }
    </div>
));

const SortableItem = SortableElement(({ figureId, statusId }) => <Status key={statusId} figureId={figureId} statusId={statusId} />);

const mapStateToProps = (state, ownProps) => ({
    visibility: state.getIn(['virtualAsset', 'figure', 'sequence', ownProps.figureId, 'visibility']),
    statusIdList: List(state.getIn(['virtualAsset', 'figure', 'sequence', ownProps.figureId, 'status', 'sequence']).keySeq()),
});

const mapDispatchToProps = dispatch => ({
    panelSort: ({ figureId, oldIndex, newIndex }) =>
        dispatch({
            type: 'VIRTUAL_ASSET_STATUS_REORDER',
            figureId,
            oldIndex,
            newIndex,
        }),
});

export default connect(mapStateToProps, mapDispatchToProps)(Statuses);

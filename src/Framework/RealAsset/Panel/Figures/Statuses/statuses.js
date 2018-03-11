import React from 'react';
import { connect } from 'react-redux';
import { List } from 'immutable';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import PropTypes from 'prop-types';
import Status from './status';

const Statuses = ({ figureId, visibility, animateLocked, statusList, panelSort }) => (
    <div
      id={`${figureId}statuses`}
      style={{ width: '100%', transition: 'height 0.4s ease-out',
        height: visibility ? `${statusList.length * 35}px` : '0px', overflow: 'hidden' }}
    >
        <SortableList id="figuresGroup" figureId={figureId} items={statusList} onSortEnd={({ oldIndex, newIndex }, event) => panelSort({ event, animateLocked, figureId, oldIndex, newIndex })} pressDelay={200} transitionDuration={100} />
    </div>
);

Statuses.propTypes = {
    figureId: PropTypes.string.isRequired,
    visibility: PropTypes.bool.isRequired,
    animateLocked: PropTypes.bool.isRequired,
    statusList: PropTypes.array.isRequired,
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
    visibility: state.getIn(['realAsset', 'figuresGroup', ownProps.figureId, 'visibility']),
    statusList: List(state.getIn(['realAsset', 'figuresGroup', ownProps.figureId, 'status']).keySeq()).toArray(),
    animateLocked: state.getIn(['realAsset', 'content', 'animate', 'locked']),
});

const mapDispatchToProps = dispatch => ({
    panelSort: ({ event, animateLocked, figureId, oldIndex, newIndex }) => {
        if (event.pageX > 300) {
            if (animateLocked) {
                dispatch({
                    type: 'ANIMATE_ADD_SEQUENCE',
                    figureId,
                    oldIndex,
                });
            } else {
                dispatch({
                    type: 'STATUS_ADD_SEQUENCE',
                    figureId,
                    oldIndex,
                });
            }
        } else {
            dispatch({
                type: 'STATUS_REORDER',
                figureId,
                oldIndex,
                newIndex,
            });
        }
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(Statuses);

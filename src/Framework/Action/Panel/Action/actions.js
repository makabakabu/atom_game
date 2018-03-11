import React from 'react';
import { connect } from 'react-redux';
import { List } from 'immutable';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import PropTypes from 'prop-types';
import Action from './action';

const Actions = ({ actionKey, visibility, actionList, panelSort }) => (
    <div
      id={`${actionKey}statuses`}
      style={{ width: '100%', transition: 'height 0.4s ease-out',
        height: visibility ? `${actionList.length * 35}px` : '0px', overflow: 'hidden' }}
    >
        <SortableList id="figuresGroup" actionKey={actionKey} items={actionList} onSortEnd={({ oldIndex, newIndex }) => panelSort({ actionKey, oldIndex, newIndex })} pressDelay={200} transitionDuration={100} />
    </div>
);

Actions.propTypes = {
    actionKey: PropTypes.string.isRequired,
    visibility: PropTypes.bool.isRequired,
    actionList: PropTypes.array.isRequired,
    panelSort: PropTypes.func.isRequired,
};

const SortableList = SortableContainer(({ actionKey, items }) => (
    <div>
        {
            items.map((actionId, index) => (
                <SortableItem key={actionId + index} index={index} actionKey={actionKey} actionId={actionId} />
            ))
        }
    </div>
));

const SortableItem = SortableElement(({ actionKey, actionId }) => <Action key={actionId} actionId={actionId} actionKey={actionKey} />);

const mapStateToProps = (state, ownProps) => ({
    visibility: state.getIn(['action', 'actionSequence', ownProps.actionKey, 'panelVisibility']),
    actionList: List(state.getIn(['action', 'actionSequence', ownProps.actionKey, 'sequence']).keySeq()).toArray(),
});

const mapDispatchToProps = dispatch => ({
    panelSort: ({ actionKey, oldIndex, newIndex }) =>
        dispatch({
            type: 'ACTION_REORDER',
            actionKey,
            oldIndex,
            newIndex,
        }),
});

export default connect(mapStateToProps, mapDispatchToProps)(Actions);

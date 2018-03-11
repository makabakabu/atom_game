import React from 'react';
import { connect } from 'react-redux';
import { List } from 'immutable';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import PropTypes from 'prop-types';
import Figure from './figure';

const Statuses = ({ figureList, panelSort }) => (
    <SortableList items={figureList} onSortEnd={({ oldIndex, newIndex }) => panelSort({ oldIndex, newIndex })} pressDelay={200} transitionDuration={100} />
);

Statuses.propTypes = {
    figureList: PropTypes.array.isRequired,
    panelSort: PropTypes.func.isRequired,
};

const SortableList = SortableContainer(({ items }) => (
    <div style={{ height: '96%' }}>
        {
            items.map((figureId, index) => (
                <SortableItem key={figureId + index} index={index} figureId={figureId} />
            ))
        }
    </div>
));

const SortableItem = SortableElement(({ figureId }) => <Figure key={figureId} figureId={figureId} />);

const mapStateToProps = state => ({
    figureList: List(state.getIn(['virtualAsset', 'figure', 'sequence']).keySeq()).toArray(),
});

const mapDispatchToProps = dispatch => ({
    panelSort: ({ oldIndex, newIndex }) =>
        dispatch({
            type: 'VIRTUALASSET_REORDER_ASSET',
            oldIndex,
            newIndex,
        }),
});

export default connect(mapStateToProps, mapDispatchToProps)(Statuses);

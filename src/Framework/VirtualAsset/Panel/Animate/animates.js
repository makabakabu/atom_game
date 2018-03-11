import React from 'react';
import { connect } from 'react-redux';
import { List } from 'immutable';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import PropTypes from 'prop-types';
import Animate from './animate';

const Animates = ({ animateList, panelSort }) => (
    <SortableList items={animateList} onSortEnd={({ oldIndex, newIndex }) => panelSort({ oldIndex, newIndex })} pressDelay={200} transitionDuration={100} />
);

Animates.propTypes = {
    animateList: PropTypes.array.isRequired,
    panelSort: PropTypes.func.isRequired,
};

const SortableList = SortableContainer(({ items }) => (
    <div style={{ height: '96%' }}>
        {
            items.map((animateId, index) => (
                <SortableItem key={animateId + index} index={index} animateId={animateId} />
            ))
        }
    </div>
));

const SortableItem = SortableElement(({ animateId }) => <Animate key={animateId} animateId={animateId} />);

const mapStateToProps = state => ({
    animateList: List(state.getIn(['virtualAsset', 'animate', 'sequence']).keySeq()).toArray(),
});

const mapDispatchToProps = dispatch => ({
    panelSort: ({ oldIndex, newIndex }) =>
        dispatch({
            type: 'VIRTUALASSET_REORDER_ASSET',
            oldIndex,
            newIndex,
        }),
});

export default connect(mapStateToProps, mapDispatchToProps)(Animates);

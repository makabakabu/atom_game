import React from 'react';
import { connect } from 'react-redux';
import { List } from 'immutable';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import PropTypes from 'prop-types';
import Figure from './figure';

const Figures = ({ figureList, panelSort, isEdit }) => (
    <SortableList items={figureList} isEdit={isEdit} onSortEnd={({ oldIndex, newIndex }) => panelSort({ oldIndex, newIndex })} lockAxis="y" pressDelay={200} transitionDuration={100} disabled />
);

Figures.propTypes = {
    figureList: PropTypes.array.isRequired,
    panelSort: PropTypes.func.isRequired,
    isEdit: PropTypes.bool.isRequired,
};

const SortableList = SortableContainer(({ items, isEdit }) => (
    <div style={{ height: '96%' }}>
        {
            items.map((figureId, index) => (
                <SortableItem key={figureId + index} index={index} figureId={figureId} disabled={!isEdit} />
            ))
        }
    </div>
));

const SortableItem = SortableElement(({ figureId }) => <Figure key={figureId} figureId={figureId} />);

const mapStateToProps = (state) => {
    const viewMode = state.getIn(['virtualAsset', 'viewMode']);
    let focusedId = state.getIn(['virtualAsset', viewMode, 'focusedFigureId']);
    if (viewMode === 'animate') {
        focusedId = state.getIn(['virtualAsset', viewMode, 'focusedAnimateId']);
    }
    return {
        figureList: focusedId === '' ? [] : List(state.getIn(['virtualAsset', viewMode, 'sequence', focusedId, 'figure', 'sequence']).keySeq()).toArray(),
        isEdit: focusedId !== '' && state.getIn(['virtualAsset', viewMode, 'sequence', focusedId, 'figure', 'focusedFigureId']) !== '',
    };
};

const mapDispatchToProps = dispatch => ({
    panelSort: ({ oldIndex, newIndex }) =>
        dispatch({
            type: 'VIRTUALASSET_SIMULATION_REORDER_FIGURE',
            oldIndex,
            newIndex,
        }),
});

export default connect(mapStateToProps, mapDispatchToProps)(Figures);

import React from 'react';
import { connect } from 'react-redux';
import { List } from 'immutable';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import { ContextMenuTrigger } from 'react-contextmenu';
import PropTypes from 'prop-types';
import Animate from './animate';
import Menu from './menu';

const Animates = ({ animateIdList, panelSort }) => (
    <div id="figures" style={styles.main} >
        <ContextMenuTrigger id="figuresMenu">
            <SortableList items={animateIdList} onSortEnd={({ oldIndex, newIndex }) => panelSort({ oldIndex, newIndex })} pressDelay={200} transitionDuration={100} />
        </ContextMenuTrigger>
        <Menu />
    </div>
);

const styles = {
    main: {
        height: '96%',
        width: '100%',
        overflowY: 'auto',
    },
};

Animates.propTypes = {
    animateIdList: PropTypes.array.isRequired,
    panelSort: PropTypes.func.isRequired,
};

const SortableList = SortableContainer(({ items }) => (
    <div>
        {
            items.map((animateId, index) => (
                <SortableItem key={animateId + index} index={index} animateId={animateId} />
            ))
        }
    </div>
));

const SortableItem = SortableElement(({ animateId }) => <Animate key={animateId} animateId={animateId} />);

const mapStateToProps = state => ({
    animateIdList: List(state.getIn(['virtualAsset', 'animate', 'sequence']).keySeq()),
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

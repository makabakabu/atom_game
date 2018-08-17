import React from 'react';
import { connect } from 'react-redux';
import { List } from 'immutable';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import PropTypes from 'prop-types';
import Animate from './animate';

const Animates = ({ figureId, visibility, locked, animateList, panelSort }) => (
    <div
      id={`${figureId}animates`}
      style={{ width: '100%', transition: 'height 0.4s ease-out',
        height: visibility ? `${animateList.length * 35}px` : '0px', overflow: 'hidden' }}
    >
        <SortableList id="figuresGroup" figureId={figureId} items={animateList} onSortEnd={({ oldIndex, newIndex }, event) => panelSort({ event, locked, figureId, oldIndex, newIndex })} pressDelay={200} transitionDuration={100} />
    </div>
);

Animates.propTypes = {
    figureId: PropTypes.string.isRequired,
    visibility: PropTypes.bool.isRequired,
    locked: PropTypes.bool.isRequired,
    animateList: PropTypes.array.isRequired,
    panelSort: PropTypes.func.isRequired,
};

const SortableList = SortableContainer(({ figureId, items }) => (
    <div>
        {
            items.map((animateId, index) => (
                <SortableItem key={animateId + index} index={index} figureId={figureId} animateId={animateId} />
            ))
        }
    </div>
));

const SortableItem = SortableElement(({ figureId, animateId }) => <Animate key={animateId} figureId={figureId} animateId={animateId} />);

const mapStateToProps = (state, ownProps) => ({
    visibility: state.getIn(['realAsset', 'figuresGroup', ownProps.figureId, 'visibility']),
    animateList: List(state.getIn(['realAsset', 'figuresGroup', ownProps.figureId, 'animate']).keySeq()).toArray(),
    locked: state.getIn(['realAsset', 'content', 'animate', 'locked']),
});

const mapDispatchToProps = dispatch => ({
    panelSort: ({ event, locked, figureId, oldIndex, newIndex }) => {
        if (event.pageX > 300 && locked) {
            dispatch({
                type: 'ANIMATE_ADD_SEQUENCE',
                figureId,
                oldIndex,
            });
        } else {
            dispatch({
                type: 'ANIMATE_REORDER',
                figureId,
                oldIndex,
                newIndex,
            });
        }
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(Animates);

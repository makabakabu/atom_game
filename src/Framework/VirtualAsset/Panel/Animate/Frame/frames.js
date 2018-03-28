import React from 'react';
import { connect } from 'react-redux';
import { List } from 'immutable';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import ImmutablePropTypes from 'react-immutable-proptypes';
import PropTypes from 'prop-types';
import Frame from './frame';

const Frames = ({ animateId, visibility, frameIdList, panelSort }) => (
    <div
      id={`${animateId}virtualAsset_frames`}
      style={{ width: '100%', transition: 'height 0.4s ease-out',
        height: visibility ? frameIdList.length * 35 : 0, overflow: 'hidden' }}
    >
        <SortableList animateId={animateId} items={frameIdList} onSortEnd={({ oldIndex, newIndex }) => panelSort({ animateId, oldIndex, newIndex })} pressDelay={200} transitionDuration={100} />
    </div>
);

Frames.propTypes = {
    animateId: PropTypes.string.isRequired,
    visibility: PropTypes.bool.isRequired,
    frameIdList: ImmutablePropTypes.list.isRequired,
    panelSort: PropTypes.func.isRequired,
};

const SortableList = SortableContainer(({ animateId, items }) => (
    <div>
        {
            items.map((frameId, index) => (
                <SortableItem key={animateId + index} index={index} animateId={animateId} frameId={frameId} />
            ))
        }
    </div>
));

const SortableItem = SortableElement(({ animateId, frameId }) => <Frame key={animateId} animateId={animateId} frameId={frameId} />);

const mapStateToProps = (state, ownProps) => ({
    visibility: state.getIn(['virtualAsset', 'animate', 'sequence', ownProps.animateId, 'visibility']),
    frameIdList: List(state.getIn(['virtualAsset', 'animate', 'sequence', ownProps.animateId, 'frame', 'sequence']).keySeq()),
});

const mapDispatchToProps = dispatch => ({
    panelSort: ({ animateId, oldIndex, newIndex }) => {
        dispatch({
            type: 'VIRTUAL_ASSET_ANIMATE_REORDER',
            animateId,
            oldIndex,
            newIndex,
        });
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(Frames);

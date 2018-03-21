import React from 'react';
import { connect } from 'react-redux';
import { List } from 'immutable';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import { ContextMenuTrigger } from 'react-contextmenu';
import uuidv4 from 'uuid';
import Menu from './menu';
import Board from './board';
import FunctionPanel from './functionPanel';
import LoopLine from './loopLine';

const AnimatePreview = ({ isFocused, frameSequence, panelSort, loopSequence }) => (
    <div style={{ width: '100%', marginTop: '10px', display: 'flex', justifyContent: 'flex-start', flexWrap: 'wrap' }}>
        { isFocused ? <FunctionPanel /> : <div style={{ height: '100px', width: '100%' }} /> }
        <ContextMenuTrigger id="animateMenu">
            <div style={{ width: '100%', height: '20px', marginTop: '15px', marginBottom: '-15px', display: 'flex', justifyContent: 'flex-start' }}>
                {
                    loopSequence.map((loop, loopIndex) => <LoopLine key={uuidv4()} loop={loop} loopIndex={loopIndex} index={List(frameSequence.keySeq()).indexOf(loop.getIn(['sequence', 0])) - (loopIndex > 0 ? List(frameSequence.keySeq()).indexOf(loopSequence.getIn([loopIndex - 1, 'sequence', -1])) : 0)} />)
                }
            </div>
            <div style={styles.main}>
                <SortableList frameSequence={frameSequence} items={List(frameSequence.keySeq())} onSortEnd={({ oldIndex, newIndex }) => panelSort({ oldIndex, newIndex })} pressDelay={200} transitionDuration={100} axis="x" lockAxis="x" />
            </div>
        </ContextMenuTrigger>
        <Menu />
    </div>
);

AnimatePreview.propTypes = {
    isFocused: PropTypes.bool.isRequired,
    frameSequence: ImmutablePropTypes.orderedMap.isRequired,
    panelSort: PropTypes.func.isRequired,
    loopSequence: ImmutablePropTypes.list.isRequired,
};

const SortableList = SortableContainer(({ frameSequence, items }) => (
    <div style={styles.main}>
        {
            items.map((frameId, index) => (
                <SortableItem key={frameId + index} index={index} figureId={frameSequence.getIn([frameId, 'figureId'])} statusId={frameSequence.getIn([frameId, 'statusId'])} frameId={frameId} />
            ))
        }
    </div>
));

const SortableItem = SortableElement(({ figureId, statusId, frameId }) =>
    <Board key={`${frameId}FigureBoard`} figureId={figureId} statusId={statusId} frameId={frameId} />);

let styles = {
    main: {
        display: 'flex',
        justifyContent: 'flex-start',
        flexWrap: 'nowrap',
        alignItems: 'center',
    },
};

const mapStateToProps = (state) => {
    const focusedAnimate = state.getIn(['realAsset', 'content', 'animate', 'focusedAnimate']);
    const animate = state.getIn(['realAsset', 'figuresGroup', focusedAnimate.get('figureId'), 'animate', focusedAnimate.get('animateId')]);
    const isFocused = animate.get('focusedFrame').size > 0;
    return {
        isFocused,
        frameSequence: animate.get('frameSequence'),
        loopSequence: state.getIn(['realAsset', 'figuresGroup', focusedAnimate.get('figureId'), 'animate', focusedAnimate.get('animateId'), 'loopSequence']),
    };
};

const mapDispatchToProps = dispatch => ({
    panelSort: ({ oldIndex, newIndex }) =>
        dispatch({
            type: 'FRAME_SEQUENCE_REORDER',
            oldIndex,
            newIndex,
        }),
});

export default connect(mapStateToProps, mapDispatchToProps)(AnimatePreview);

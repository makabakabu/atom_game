import React from 'react';
import { List } from 'immutable';
import { connect } from 'react-redux';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import { ContextMenuTrigger } from 'react-contextmenu';
import { message } from 'antd';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import transit from 'transit-immutable-js';
import ImmutablePropTypes from 'react-immutable-proptypes';
import Figure from './figure';
import Menu from '../menu';

const saveResource = gql`
    mutation saveResource($kind: String!, $userName: String!, $token: String!, $content: String!) {
        saveResource(kind: $kind, userName: $userName, token: $token, content: $content) {
            id,
            content,
        }
    }
`;

const Figures = ({ figuresGroupList, figuresGroup, panelSort, hover, saveResource }) =>
(
    <div id="figures" style={styles.main} >
        <ContextMenuTrigger id="figuresMenu">
            <SortableList id="figuresGroup" items={figuresGroupList} onSortEnd={({ oldIndex, newIndex }) => panelSort({ oldIndex, newIndex, content: figuresGroup.get(figuresGroupList[oldIndex]), hover, saveResource })} pressDelay={200} transitionDuration={100} />
        </ContextMenuTrigger>
        <Menu />
    </div>
);

Figures.propTypes = {
    figuresGroupList: PropTypes.array.isRequired,
    figuresGroup: ImmutablePropTypes.orderedMap.isRequired,
    panelSort: PropTypes.func.isRequired,
    hover: PropTypes.bool.isRequired,
    saveResource: PropTypes.func.isRequired,
};

const SortableList = SortableContainer(({ items }) => (
    <div>
      {
        items.map((figureId, index) => <SortableItem key={figureId + index} index={index} figureId={figureId} />)
      }
    </div>
));

const SortableItem = SortableElement(({ figureId }) => <Figure figureId={figureId} />);

let styles = {
    main: {
        height: '96%',
        width: '100%',
        overflowY: 'auto',
    },
};

const mapStateToProps = state => ({
    figuresGroup: state.getIn(['realAsset', 'figuresGroup']),
    figuresGroupList: List(state.getIn(['realAsset', 'figuresGroup']).keySeq()).toArray(),
    hover: state.getIn(['store', 'hover']),
});

const mapDispatchToProps = dispatch => ({
    panelSort: async ({ content, oldIndex, newIndex, hover, saveResource }) => {
        if (hover && window.sessionStorage.getItem('userName') && window.sessionStorage.getItem('token')) {
            const result = await saveResource({ variables: { kind: 'RealAsset', content: transit.toJSON(content), userName: window.sessionStorage.getItem('userName'), token: window.sessionStorage.getItem('token') } });
            if (result) {
                message.success('成功添加一个人物！');
            } else {
                message.error('添加失败！');
            }
        }
        dispatch({
            type: 'FIGURE_REORDER',
            oldIndex,
            newIndex,
        });
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(graphql(saveResource, { name: 'saveResource' })(Figures));

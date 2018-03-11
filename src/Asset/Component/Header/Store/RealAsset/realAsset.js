import React from 'react';
import gql from 'graphql-tag';
import { graphql, compose } from 'react-apollo';
import transit from 'transit-immutable-js';
import PropTypes from 'prop-types';
import uuidv4 from 'uuid';
import Spinner from 'react-spinkit';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import { connect } from 'react-redux';
import { message } from 'antd';
import Preview from './Preview/preview';
import Board from './board';

const getResource = gql`
    query getResource($kind: String!, $userName: String!, $token: String!) {
        getResource(kind: $kind, userName: $userName, token: $token) {
            content,
            id
        }
    }
`;

const deleteResource = gql`
    mutation deleteResource($kind: String!, $id: String!, $userName: String!, $token: String!) {
        deleteResource(kind: $kind, id: $id, userName: $userName, token: $token) {
            content,
            id
        }
    }
`;

const RealAsset = ({ data, hover, panelSort, deleteHover, deleteUnhover, deleteResource }) => {
    if (data.loading) {
        return (<div style={{ width: '100%', height: document.documentElement.clientHeight - 250, display: 'flex', justifyContent: 'center', alignItems: 'center' }}><Spinner name="pacman" color="#aaa" /></div>);
    }
    return (
        <div style={{ width: '100%', height: document.documentElement.clientHeight - 250, display: 'flex' }}>
            <div style={{ width: '70%', height: '100%' }}>
                <SortableList items={data.getResource} onSortEnd={({ oldIndex, newIndex }) => panelSort({ oldIndex, newIndex, hover, deleteResource, resource: data.getResource })} pressDelay={200} transitionDuration={100} axis="xy" />
                <div style={{ width: '100%', height: '10%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <img
                      src={require('../../../../Image/Public/trash.png')}
                      style={{ width: '30px', height: '30px' }}
                      onMouseEnter={event => deleteHover({ event })}
                      onMouseLeave={event => deleteUnhover({ event })}
                      alt="垃圾桶"
                    />
                </div>
            </div>
            <Preview />
        </div>
    );
};

RealAsset.propTypes = {
    data: PropTypes.object.isRequired,
    panelSort: PropTypes.func.isRequired,
    deleteHover: PropTypes.func.isRequired,
    deleteUnhover: PropTypes.func.isRequired,
    hover: PropTypes.bool.isRequired,
    deleteResource: PropTypes.func.isRequired,
};

const SortableList = SortableContainer(({ items }) => (
    <div style={{ width: '100%', height: '90%', display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', justifyContent: 'flex-start' }}>
        {
            items.map((value, index) => <SortableItem key={uuidv4()} index={index} figure={transit.fromJSON(value.content)} />)
        }
    </div>
));

const SortableItem = SortableElement(({ figure }) => (
    <div key={uuidv4()} style={{ width: '102px', height: '102px', marginLeft: '5px', backgroundColor: '#ededed', zIndex: 1000 }}>
        {
            figure.get('status').size > 0 && <Board figure={figure} />
        }
    </div>
));


const mapStateToProps = state => ({
    hover: state.getIn(['store', 'realAsset', 'hover']),
});

const mapDispatchToProp = dispatch => ({
    panelSort: async ({ oldIndex, newIndex, resource, hover, deleteResource }) => {
        if (hover) {
            const result = await deleteResource({ variables: { kind: 'RealAsset', id: resource[oldIndex].id, userName: window.sessionStorage.getItem('userName'), token: window.sessionStorage.getItem('token') } });
            if (result) {
                message.success('成功删除人物！');
            } else {
                message.error('删除失败！');
            }
            dispatch({
                type: 'STORE_DELETE_HOVER',
                kind: 'realAsset',
                hover: false,
            });
            setTimeout(() => window.location.reload(), 2000);
        }
    },
    deleteHover: ({ event }) => {
        event.target.src = require('../../../../Image/Public/trashOpen.gif');
        dispatch({
            type: 'STORE_DELETE_HOVER',
            kind: 'realAsset',
            hover: true,
        });
    },
    deleteUnhover: ({ event }) => {
        event.target.src = require('../../../../Image/Public/trashClose.gif');
        dispatch({
            type: 'STORE_DELETE_HOVER',
            kind: 'realAsset',
            hover: false,
        });
    },
});

const queryOpetions = {
    options: () => ({
        variables: {
            kind: 'RealAsset',
            userName: window.sessionStorage.getItem('userName'),
            token: window.sessionStorage.getItem('token'),
        },
    }),
};

export default connect(mapStateToProps, mapDispatchToProp)(compose(graphql(getResource, queryOpetions), graphql(deleteResource, { name: 'deleteResource' }))(RealAsset));

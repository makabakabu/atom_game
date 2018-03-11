import React from 'react';
import { Input, Modal as AntModal, Tabs, message } from 'antd';
import { connect } from 'react-redux';
import Modal from 'react-responsive-modal';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import gql from 'graphql-tag';
import { graphql, compose } from 'react-apollo';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/fontawesome-free-regular';
import RealAsset from './Store/RealAsset/realAsset';
import VirtualAsset from './Store/VirtualAsset/virtualAsset';
import Action from './Store/Action/action';
import Game from './Store/Game/game';

const register = gql`
    mutation register ($userName: String!, $password: String!) {
        register (userName: $userName, password: $password) {
            token,
            userName,
        }
    }
`;

const signIn = gql`
    mutation signIn ($userName: String!, $password: String!) {
        signIn (userName: $userName, password: $password) {
            token,
            userName,
        }
    }
`;

const { TabPane } = Tabs;
const Operation = ({ account, register, signIn, store, storeVisibility, changeAccountInfo, accountSettingOk, accountVisibility, accountChangeViewMode, logOff, enterStore, leaveStore }) => (
    <div style={{ width: '250px', height: '80px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <img
          src={require('../../Image/Public/store.png')}
          style={{ width: '35px', height: '30px', marginRight: '20px' }}
          alt="资源"
          role="presentation"
          onMouseEnter={event => enterStore({ event })}
          onMouseLeave={event => leaveStore({ event })}
          onClick={storeVisibility({ visibility: true })}
        />
        <Modal open={store.get('visibility')} onClose={storeVisibility({ visibility: false })} little>
            <div style={{ width: document.documentElement.clientWidth - 300, height: document.documentElement.clientHeight - 200, marginTop: '20px' }}>
                <Tabs defaultActiveKey={store.get('viewMode')} tabBarStyle={{ display: 'flex', justifyContent: 'center' }} animated={false} style={{ width: document.documentElement.clientWidth - 520, height: document.documentElement.clientHeight - 40 }}>
                    <TabPane tab="真实资源" key="realAsset">
                        <RealAsset />
                    </TabPane>
                    <TabPane tab="虚拟资源" key="virtualAsset">
                        <VirtualAsset />
                    </TabPane>
                    <TabPane tab="事件" key="action">
                        <Action />
                    </TabPane>
                    <TabPane tab="游戏" key="game">
                        <Game />
                    </TabPane>
                    <TabPane tab="云上资源" key="web">
                        <div />
                    </TabPane>
                </Tabs>
            </div>
        </Modal>
        { window.sessionStorage.getItem('userName') ?
            <FontAwesomeIcon icon={faUser} style={{ fontSize: '23px', color: '#6a6a6a', cursor: 'pointer', marginLeft: '20px' }} onClick={logOff} /> :
            <img
              src={require('../../Image/Public/signIn.png')}
              style={{ width: '30px', height: '25px', marginLeft: '20px', cursor: 'pointer' }}
              alt="登录"
              onMouseEnter={(event) => {
                  event.target.src = require('../../Image/Public/signIn.gif');
              }}
              onMouseLeave={(event) => {
                  event.target.src = require('../../Image/Public/signIn.png');
              }}
              onClick={accountVisibility({ visibility: true })}
              role="presentation"
            />
        }
        <AntModal
          title={account.get('viewMode') === 'signIn' ? '登陆' : '注册'}
          visible={account.get('visibility')}
          onOk={accountSettingOk({ account, register, signIn })}
          onCancel={accountVisibility({ visibility: false })}
          width={350}
          okText="确定"
          cancelText="取消"
        >
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                    <div>
                        <Input placeholder="用户名" size="large" style={{ width: 200, border: 'none', borderBottom: '1px solid #ededed', outline: 'none' }} defaultValue={account.getIn([account.get('viewMode'), 'userName'])} onChange={event => changeAccountInfo({ kind: 'userName', value: event.target.value })} />
                    </div>
                    <div>
                        <Input type="password" placeholder="密码" size="large" style={{ width: 200, border: 'none', borderBottom: '1px solid #ededed', marginTop: '20px', outline: 'none' }} defaultValue={account.getIn([account.get('viewMode'), 'password'])} onChange={event => changeAccountInfo({ kind: 'password', value: event.target.value })} />
                    </div>
                    {
                        account.get('viewMode') === 'register' &&
                        <div>
                            <Input type="password" placeholder="重复密码" size="large" style={{ width: 200, border: 'none', borderBottom: '1px solid #ededed', marginTop: '20px', outline: 'none' }} defaultValue={account.getIn(['register', 'repassword'])} onChange={event => changeAccountInfo({ kind: 'rePassword', value: event.target.value })} />
                        </div>
                    }
                    <div style={{ fontSize: '16px', marginTop: '10px', color: 'blue', cursor: 'pointer' }} onClick={accountChangeViewMode} role="presentation">{account.get('viewMode') === 'signIn' ? '注册' : '登陆'}</div>
                </div>
            </div>
        </AntModal>
    </div>
);

Operation.propTypes = {
    account: ImmutablePropTypes.map.isRequired,
    register: PropTypes.func.isRequired,
    signIn: PropTypes.func.isRequired,
    store: ImmutablePropTypes.map.isRequired,
    storeVisibility: PropTypes.func.isRequired,
    changeAccountInfo: PropTypes.func.isRequired,
    accountVisibility: PropTypes.func.isRequired,
    accountSettingOk: PropTypes.func.isRequired,
    accountChangeViewMode: PropTypes.func.isRequired,
    logOff: PropTypes.func.isRequired,
    enterStore: PropTypes.func.isRequired,
    leaveStore: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
    account: state.get('account'),
    store: state.get('store'),
});

const mapDispatchToProp = dispatch => ({
    changeAccountInfo: ({ kind, value }) =>
        dispatch({
            type: 'ACCOUNT_CHNAGE_INFO',
            kind,
            value,
        }),
    accountVisibility: ({ visibility }) => () =>
        dispatch({
            type: 'ACCOUNT_CHANGE_VISIBILITY',
            visibility,
        }),
    accountSettingOk: ({ account, register, signIn }) => async () => {
        if (account.get('viewMode') === 'register') {
            if (account.getIn(['register', 'password']) === account.getIn(['register', 'rePassword']) && account.getIn(['register', 'password']).length > 8) {
                await register({ variables: { userName: account.getIn(['register', 'userName']), password: account.getIn(['register', 'password']) } });
                window.location.reload();
                dispatch({
                    type: 'ACCOUNT_CHANGE_VISIBILITY',
                    visibility: false,
                });
            }
            if (account.getIn(['register', 'password']) !== account.getIn(['register', 'rePassword'])) {
                message.error('密码和重复密码不相同！');
            }
            if (account.getIn(['register', 'password']).length <= 8) {
                message.error('密码小于8位！');
            }
        }
        if (account.get('viewMode') === 'signIn') {
            const payload = await signIn({ variables: { userName: account.getIn(['signIn', 'userName']), password: account.getIn(['signIn', 'password']) } });
            window.sessionStorage.setItem('userName', payload.data.signIn.userName);
            window.sessionStorage.setItem('token', payload.data.signIn.token);
            dispatch({
                type: 'ACCOUNT_CHANGE_VISIBILITY',
                visibility: false,
            });
        }
    },
    storeVisibility: ({ visibility }) => () =>
        dispatch({
            type: 'STORE_VISIBILITY',
            visibility,
        }),
    accountChangeViewMode: () =>
        dispatch({
            type: 'ACCOUNT_CHANGE_VIEWMODE',
        }),
    logOff: () => {
        window.sessionStorage.removeItem('userName');
        window.sessionStorage.removeItem('token');
        window.location.reload();
    },
    enterStore: ({ event }) => {
        event.target.src = require('../../Image/Public/store.gif');
        dispatch({
            type: 'ENTER_STORE',
        });
    },
    leaveStore: ({ event }) => {
        event.target.src = require('../../Image/Public/store.png');
        dispatch({
            type: 'LEAVE_STORE',
        });
    },
});

export default connect(mapStateToProps, mapDispatchToProp)(compose(graphql(register, { name: 'register' }), graphql(signIn, { name: 'signIn' }))(Operation));

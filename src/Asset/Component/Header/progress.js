import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Steps } from 'antd';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import { faArchive, faCloud, faBolt, faGamepad } from '@fortawesome/fontawesome-free-solid';

const { Step } = Steps;
const Progress = ({ viewMode, click }) => {
    const progressNode = ['realAsset', 'virtualAsset', 'action', 'game'];
    const finishedProgressNode = progressNode.slice(0, progressNode.indexOf(viewMode));
    finishedProgressNode.push(viewMode);
    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: document.documentElement.clientWidth - 500, height: 80 }}>
            <Steps style={{ width: 600 }}>
                <Step status={finishedProgressNode.includes('realAsset') ? 'finished' : 'wait'} title="真实资源" icon={<FontAwesomeIcon icon={faArchive} />} onClick={click({ viewMode: 'realAsset' })} style={{ cursor: 'pointer' }} />
                <Step status={finishedProgressNode.includes('virtualAsset') ? 'finished' : 'wait'} title="虚拟资源" icon={<FontAwesomeIcon icon={faCloud} />} onClick={click({ viewMode: 'virtualAsset' })} style={{ cursor: 'pointer' }} />
                <Step status={finishedProgressNode.includes('action') ? 'finished' : 'wait'} title="事件" icon={<FontAwesomeIcon icon={faBolt} />} onClick={click({ viewMode: 'action' })} style={{ cursor: 'pointer' }} />
                <Step status={finishedProgressNode.includes('game') ? 'finished' : 'wait'} title="游戏" icon={<FontAwesomeIcon icon={faGamepad} />} onClick={click({ viewMode: 'game' })} style={{ cursor: 'pointer' }} />
            </Steps>
        </div>
    );
};

Progress.propTypes = {
    viewMode: PropTypes.string.isRequired,
    click: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
    viewMode: state.get('viewMode'),
});

const mapDispatchToProps = dispatch => ({
    click: ({ viewMode }) => () => {
        dispatch({
            type: 'CHANGE_VIEWMODE',
            viewMode,
        });
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(Progress);

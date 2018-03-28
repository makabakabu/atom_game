import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import { Slider } from 'antd';
import { faLock, faLockOpen, faExpand, faCompress, faBackward, faPlay, faPause, faForward } from '@fortawesome/fontawesome-free-solid';
import generator from './generator';

// 标记所在frameSequence中frame位置
// loopSequence是排好序的
// 标记好位置和loop过的次数
// 初始化和注销位置
const Setting = ({
    onChange, locked, changeState, trace, progress, changeExecuteState, changeExecuteValue, frameSequence, loopSequence,
}) => (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={styles.progressBar}>
            <Slider trackStyle={[{ backgroundColor: '#aaa' }]} value={progress.get('value')} max={progress.get('max')} dotStyle={{ backgroundColor: '#aaa' }} onChange={value => changeExecuteValue({ num: value, loopSequence, frameSequence })} />
        </div>
        <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
            <div style={{ height: 30, width: '18%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12, color: '#6a6a6a' }}>
                <div style={{ width: 60, display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
                    锁定:
                    <div style={{ width: 25, height: 25, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <FontAwesomeIcon icon={locked ? faLock : faLockOpen} style={{ color: locked ? '#6a6a6a' : '#ccc' }} onClick={changeState({ kind: 'locked' })} role="presentation" size="lg" />
                    </div>
                </div>
                <div style={{ width: 60, display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
                    寻迹:
                    <img style={{ width: 30, height: 30 }} src={require(`Asset/Image/Public/trace${trace ? '_selected' : ''}.png`)} onClick={changeState({ kind: 'trace' })} role="presentation" alt="寻迹" />
                </div>
            </div>
            <div id="execute" style={styles.progressControlContainer} >
                <FontAwesomeIcon icon={faBackward} onMouseDown={() => changeExecuteValue({ num: progress.get('value') - 1, frameSequence, loopSequence })} />
                <FontAwesomeIcon icon={progress.get('execute') ? faPause : faPlay} onMouseDown={changeExecuteState({ progress, frameSequence, loopSequence, num: progress.get('value') })} />
                <FontAwesomeIcon icon={faForward} onMouseDown={() => changeExecuteValue({ num: progress.get('value') + 1, frameSequence, loopSequence })} />
            </div>
            <div style={{ width: '15%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#6a6a6a', fontSize: 12 }}>
                <div style={{ width: '42%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        放大:
                    </div>
                    <div style={{ width: 20, height: 20, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <FontAwesomeIcon id="larger" icon={faExpand} size="lg" style={{ cursor: 'pointer', transition: 'all 0.1s ease-in-out' }} onMouseDown={onChange({ value: 0.1 })} />
                    </div>
                </div>
                <div style={{ width: '42%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        缩小:
                    </div>
                    <div style={{ width: 20, height: 20, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <FontAwesomeIcon id="smaller" icon={faCompress} size="lg" style={{ cursor: 'pointer', transition: 'all 0.1s ease-in-out' }} onMouseDown={onChange({ value: -0.1 })} />
                    </div>
                </div>
            </div>
        </div>
    </div>
);

Setting.propTypes = {
    onChange: PropTypes.func.isRequired,
    locked: PropTypes.bool.isRequired,
    trace: PropTypes.bool.isRequired,
    changeState: PropTypes.func.isRequired,
    progress: ImmutablePropTypes.map.isRequired,
    changeExecuteState: PropTypes.func.isRequired,
    changeExecuteValue: PropTypes.func.isRequired,
    frameSequence: ImmutablePropTypes.orderedMap.isRequired,
    loopSequence: ImmutablePropTypes.list.isRequired,
};

const styles = {
    progressBar: {
        width: '100%',
        height: 25,
        marginTop: -7,
    },
    progressControlContainer: {
        width: '20%',
        marginLeft: '3%',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: 20,
        color: '#6a6a6a',
    },
};

const mapStateToProps = (state) => {
    const focusedAnimate = state.getIn(['realAsset', 'content', 'animate', 'focusedAnimate']);
    return {
        locked: state.getIn(['realAsset', 'content', 'animate', 'locked']),
        trace: state.getIn(['realAsset', 'content', 'animate', 'trace']),
        progress: state.getIn(['realAsset', 'figuresGroup', focusedAnimate.get('figureId'), 'animate', focusedAnimate.get('animateId'), 'progress']),
        loopSequence: state.getIn(['realAsset', 'figuresGroup', focusedAnimate.get('figureId'), 'animate', focusedAnimate.get('animateId'), 'loopSequence']),
        frameSequence: state.getIn(['realAsset', 'figuresGroup', focusedAnimate.get('figureId'), 'animate', focusedAnimate.get('animateId'), 'frameSequence']),
    };
};

const mapDispatchToProps = (dispatch) => {
    const mouseupListener = () => {
        document.getElementById('larger').style.fontSize = 16;
        document.getElementById('smaller').style.fontSize = 16;
        document.removeEventListener('mouseup', mouseupListener, true);
    };
    return {
        onChange: ({ value }) => () => {
            if (value > 0) {
                document.getElementById('larger').style.fontSize = 20;
            } else {
                document.getElementById('smaller').style.fontSize = 12;
            }
            document.addEventListener('mouseup', mouseupListener, true);
            dispatch({
                type: 'ANIMATE_SCALE',
                value,
            });
        },
        changeState: ({ kind }) => () =>
            dispatch({
                type: 'ANIMATE_CHANGE_STATE',
                kind,
            }),
        changeExecuteState: ({ progress, frameSequence, loopSequence, num }) => () => {
            setTimeout(() =>
                dispatch({
                    type: 'ANIMATE_EXECUTE_CHANGE_STATE',
                }), 200);
            while (progress.get('execute')) {
                num += 1;
                console.log(num);
                const { time, frameList } = generator({ frameSequence, loopSequence, num });
                setTimeout(() => {
                    dispatch({
                        type: 'ANIMATE_EXECUTE',
                        frameList,
                    });
                }, time * 100);
            }
        },
        changeExecuteValue: ({ num, frameSequence, loopSequence }) => {
            dispatch({
                type: 'ANIMATE_EXECUTE',
                frameList: generator({ frameSequence, loopSequence, num }).frameList,
            });
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Setting);

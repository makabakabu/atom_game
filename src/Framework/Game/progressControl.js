import React from 'react';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import { faBackward, faPlay, faPause, faForward } from '@fortawesome/fontawesome-free-solid';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

const ProgressControl = ({ execute, changeExecute }) => (
    <div style={styles.main} >
        <div style={styles.progressBar}>
            <Slider trackStyle={[{ backgroundColor: '#aaa' }]} dotStyle={{ backgroundColor: '#aaa' }} style={{ width: '98%' }} />
        </div>
        <div style={styles.progressControl}>
            <div style={{ width: 150, display: 'flex', justifyContent: 'space-between' }}>
                <FontAwesomeIcon icon={faBackward} size="lg" />
                <FontAwesomeIcon icon={execute ? faPause : faPlay} size="lg" onClick={changeExecute} />
                <FontAwesomeIcon icon={faForward} size="lg" />
            </div>
        </div>
    </div>
);

ProgressControl.propTypes = {
    execute: PropTypes.bool.isRequired,
    changeExecute: PropTypes.func.isRequired,
};

const styles = {
    main: {
        width: '80%',
        height: '7%',
    },
    progressBar: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '30%',
    },
    progressControl: {
        width: '100%',
        height: '70%',
        display: 'flex',
        justifyContent: 'center',
    },
};

const mapStateToProps = state => ({
    execute: state.getIn(['game', 'execute']),
});

const mapDispatchToProp = dispatch => ({
    changeExecute: () =>
        dispatch({
            type: 'GAME_CHANGE_EXECUTE',
        }),
});

export default connect(mapStateToProps, mapDispatchToProp)(ProgressControl);

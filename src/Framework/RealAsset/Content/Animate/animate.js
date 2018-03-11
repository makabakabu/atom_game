import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import AnimateBoard from './AnimateBoard/animateBoard';
import AnimatePreview from './AnimatePreview/animatePreview';

const AnimateContent = ({ isFocused }) =>
(
    <div style={styles.main}>
        {
            isFocused && (
            <div style={{ width: '80%' }}>
                <AnimateBoard />
                <AnimatePreview />
            </div>)
        }

    </div>
);

AnimateContent.propTypes = {
    isFocused: PropTypes.bool.isRequired,
};

let styles = {
    main: {
        height: document.documentElement.clientHeight - 100,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
};

const mapStateToProps = state => ({
    isFocused: state.getIn(['realAsset', 'content', 'animate', 'focusedAnimate', 'animateId']) !== '',
});

export default connect(mapStateToProps)(AnimateContent);

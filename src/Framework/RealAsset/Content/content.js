import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Status from './Status/status';
import Animate from './Animate/animate';

const Content = ({ viewMode, animateLocked }) => (
    <div style={{ width: document.documentElement.clientWidth - ((viewMode === 'animate' || animateLocked) ? 250 : 500) }}>
        { (viewMode === 'animate' || animateLocked) ? <Animate /> : <Status /> }
    </div>
);

Content.propTypes = {
    viewMode: PropTypes.string.isRequired,
    animateLocked: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
    viewMode: state.getIn(['realAsset', 'content', 'viewMode']),
    animateLocked: state.getIn(['realAsset', 'content', 'animate', 'locked']),
});

export default connect(mapStateToProps)(Content);

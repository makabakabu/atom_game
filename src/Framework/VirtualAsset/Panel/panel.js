import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Figures from './Figure/figures';
import Animates from './Animate/animates';
import Bottom from './bottom';

const Panel = ({ virtualViewMode, viewMode }) => (
    <div style={{ ...style, height: document.documentElement.clientHeight - (viewMode === 'virtualAsset' ? 100 : 160) }} >
        { virtualViewMode === 'figure' ? <Figures /> : <Animates /> }
        <Bottom />
    </div>
);

Panel.propTypes = {
    virtualViewMode: PropTypes.string.isRequired,
    viewMode: PropTypes.string.isRequired,
};

const style = {
    display: 'flex',
    flexDirection: 'column',
    width: '238px',
    marginLeft: '8px',
};

const mapStateToProps = state => ({
    viewMode: state.get('viewMode'),
    virtualViewMode: state.getIn(['virtualAsset', 'viewMode']),
});

export default connect(mapStateToProps)(Panel);

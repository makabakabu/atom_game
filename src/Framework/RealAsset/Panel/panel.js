import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Figures from './Figures/figures';
import Bottom from './bottom';

const Panel = ({ viewMode }) => (
    <div style={{ ...style, height: document.documentElement.clientHeight - (viewMode === 'realAsset' ? 100 : 160) }} >
        <Figures />
        <Bottom />
    </div>
);

Panel.propTypes = {
    viewMode: PropTypes.string.isRequired,
};

const style = {
    display: 'flex',
    flexDirection: 'column',
    width: 238,
    marginLeft: 8,
};

const mapStateToProps = state => ({
    viewMode: state.get('viewMode'),
});

export default connect(mapStateToProps)(Panel);

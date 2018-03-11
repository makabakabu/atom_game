import React from 'react';
import PropTypes from 'prop-types';

const TabBar = ({ name, color }) => (
    <div style={{ color }}>
        { name }
        <div style={{ height: '1px', width: '100%', backgroundColor: color, marginTop: '5px' }} />
    </div>
);

TabBar.propTypes = {
    name: PropTypes.string.isRequired,
    color: PropTypes.string.isRequired,
};

export default TabBar;

import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { CirclePicker } from 'react-color';

const Picker = ({ preserveViewMode, colorPicker }) => (
    <div style={{ width: '90%', fontSize: 13, color: '#aaa' }}>
        <div style={{ width: 200, display: 'flex', justifyContent: 'center' }}>
            <CirclePicker onChange={color => colorPicker({ color, preserveViewMode })} color="#ededed" style={{ transition: 'all 1s ease-out' }} />
        </div>
    </div>
);

Picker.propTypes = {
    colorPicker: PropTypes.func.isRequired,
    preserveViewMode: PropTypes.string.isRequired,
};

const mapStateToProps = (state, ownProps) => ({
    preserveViewMode: ownProps.paintToolOperation.get('preserveViewMode'),
});

const mapDispatchToProps = dispatch => ({
    colorPicker: ({ color, preserveViewMode }) => {
        dispatch({
            type: 'VIRTUALASSET_PAINTTOOL_SELECT',
            viewMode: preserveViewMode,
        });
        dispatch({
            type: 'VIRTUALASSET_PAINTTOOL_MACRO_COLOR',
            hex: color.hex,
        });
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(Picker);

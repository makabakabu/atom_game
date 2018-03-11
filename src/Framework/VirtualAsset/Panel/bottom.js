import React from 'react';
import PropTypes from 'prop-types';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/fontawesome-free-solid';
import { connect } from 'react-redux';

const Bottom = ({ color, changeViewMode, addAsset }) => (
    <div style={styles.main}>
        <div style={styles.viewMode}>
            <div style={{ ...styles.choice, backgroundColor: color[2], color: color[3] }} onMouseDown={changeViewMode({ viewMode: 'figure' })} role="presentation">
                人物
            </div>
            <div style={{ ...styles.choice, backgroundColor: color[0], color: color[1] }} onMouseDown={changeViewMode({ viewMode: 'animate' })} role="presentation">
                动画
            </div>
        </div>
        <FontAwesomeIcon id="addAsset" icon={faPlus} style={styles.addAsset} onMouseDown={addAsset} role="presentation" />
    </div>
);

Bottom.propTypes = {
    color: PropTypes.array.isRequired,
    changeViewMode: PropTypes.func.isRequired,
    addAsset: PropTypes.func.isRequired,
};

let styles = {
    main: {
        width: '100%',
        height: '4%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        overflow: 'hidden',
    },
    viewMode: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '80%',
    },
    choice: {
        height: '30px',
        width: '35px',
        cursor: 'pointer',
        marginLeft: '10px',
        border: 'none',
        fontSize: '12px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: '10px',
    },
    addAsset: {
        cursor: 'pointer',
        color: '#aaa',
        fontSize: '16px',
        width: '10%',
        transition: 'all 0.1s ease-in-out',
    },
};

const mapStateToProps = state => ({
    color: state.getIn(['virtualAsset', 'viewMode']) === 'animate' ? ['#ededed', '#6a6a6a', '#f9f9f9', '#aaa'] : ['#f9f9f9', '#aaa', '#ededed', '#6a6a6a'],
});

const mapDispatchToProps = (dispatch) => {
    const mouseupListener = () => {
        document.getElementById('addAsset').style.fontSize = '16px';
        document.removeEventListener('mouseup', mouseupListener, true);
    };
    return {
        changeViewMode: ({ viewMode }) => () => {
            dispatch({
                type: 'VIRTUALASSET_CHNAGE_VIEWMODE',
                viewMode,
            });
        },
        addAsset: () => {
            document.getElementById('addAsset').style.fontSize = '10px';
            document.addEventListener('mouseup', mouseupListener, true);
            dispatch({
                type: 'VIRTUALASSET_ADD_ASSET',
            });
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Bottom);

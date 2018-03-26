import React from 'react';
import { Button } from 'antd';
import { connect } from 'react-redux';
import uuidv4 from 'uuid';
import ImmutablePropTypes from 'react-immutable-proptypes';
import PropTypes from 'prop-types';

const Preview = ({ focus, use }) => (
    <div style={{ width: '30%', height: '100%' }}>
        <div style={{ width: '100%', height: '90%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center' }}>
            {
                focus.size > 0 && focus.get('status').map(status => (
                    <div key={uuidv4()} style={{ width: 100, height: 75, display: 'flex', flexWrap: 'wrap', margin: 4 }} role="presentation">
                        {
                            status.get('value').map((rowList, rowIndex) =>
                                rowList.map((cell, colIndex) =>
                                    <div style={{ backgroundColor: cell.get('hex'), width: 100 / rowList.size, height: 75 / focus.get('status').first().get('value').size }} key={`figureFrame${rowIndex}_${colIndex}`} id={`figureFrame${rowIndex}_${colIndex}`} />))
                        }
                    </div>
                )).valueSeq().toArray()
            }
        </div>
        <div style={{ width: '100%', height: '10%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Button onClick={use({ figure: focus })}>使用</Button>
        </div>
    </div>
);

Preview.propTypes = {
    focus: ImmutablePropTypes.map.isRequired,
    use: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
    focus: state.getIn(['store', 'realAsset', 'focus']),
});

const mapDispatchToProp = dispatch => ({
    use: ({ figure }) => () => {
        dispatch({
            type: 'REALASSET_STORE_CLONE',
            figure,
        });
    },
});

export default connect(mapStateToProps, mapDispatchToProp)(Preview);

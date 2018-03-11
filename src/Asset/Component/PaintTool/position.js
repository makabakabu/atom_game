import React from 'react';
import PropTypes from 'prop-types';

const Position = ({ viewMode, bracket, operationMouseDown, operationMouseUp, positionChangeViewMode, bracketSelect }) => {
    bracketSelect = viewMode === 'location' ? () => () => {} : bracketSelect;
    bracket = viewMode === 'location' ? '' : bracket;
    return (
        <div style={{ display: 'flex', flexDirection: 'column', width: '80px', height: '80px', justifyContent: 'space-between', alignItems: 'center' }}>
            <div
              id={`${viewMode}TopCircle`}
              style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '10%', width: '100%', cursor: 'pointer', fontSize: '25px', marginLeft: '10px' }}
              onMouseDown={operationMouseDown({ viewMode, bracket, direction: 'top' })}
              onMouseUp={operationMouseUp({ viewMode, bracket, direction: 'top' })}
              role="presentation"
            >●
            </div>
            <div style={{ display: 'flex', width: '100%', height: '80%' }}>
                <div id={`${viewMode}LeftCircle`} style={{ cursor: 'pointer', width: '10%', height: '100%', display: 'flex', alignItems: 'center', fontSize: '25px' }} onMouseDown={operationMouseDown({ viewMode, bracket, direction: 'left' })} onMouseUp={operationMouseUp({ viewMode, bracket, direction: 'left' })} role="presentation"> ● </div>
                <div style={{ width: '80%', height: '100%', marginLeft: '10px', marginTop: '2%' }}>
                    <div style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', height: '37%', width: '100%', transition: 'all 0.2s ease-in-out' }} onClick={bracketSelect({ bracket: 'top' })} role="presentation">
                        <div id={`${viewMode}TopBracket`} style={{ color: bracket === 'top' ? '#6a6a6a' : '#ccc', height: '30%', marginTop: viewMode === 'location' ? '45%' : '12%', transition: 'all 0.2s ease-in-out', transform: `scaleY(${viewMode === 'location' ? -1 : 1})` }} >︵</div>
                    </div>
                    <div style={{ display: 'flex', width: '100%', height: '26%', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', width: '30%', transition: 'all 0.2s ease-in-out' }} onClick={bracketSelect({ bracket: 'left' })} role="presentation">
                            <div id={`${viewMode}LeftBracket`} style={{ color: bracket === 'left' ? '#6a6a6a' : '#ccc', width: '30%', marginLeft: '70%', transition: 'all 0.2s ease-in-out', transform: `scaleX(${viewMode === 'location' ? -1 : 1})` }}> ( </div>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '40%', transition: 'all 0.2s ease-in-out' }}>
                            <div style={{ cursor: 'pointer', color: viewMode === 'location' ? '#6a6a6a' : '#ccc' }} onClick={positionChangeViewMode({ viewMode: viewMode === 'location' ? 'size' : 'location' })} role="presentation"> + </div>
                        </div>
                        <div style={{ cursor: 'pointer', color: bracket === 'right' ? '#6a6a6a' : '#ccc', display: 'flex', alignItems: 'center', width: '30%', transition: 'all 0.2s ease-in-out' }} onClick={bracketSelect({ bracket: 'right' })} role="presentation">
                            <div id={`${viewMode}RightBracket`} style={{ width: '30%', marginLeft: '5%', transition: 'all 0.2s ease-in-out', transform: `scaleX(${viewMode === 'location' ? -1 : 1})` }}> ) </div>
                        </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '37%', width: '100%', transition: 'all 0.2s ease-in-out' }} onClick={bracketSelect({ bracket: 'bottom' })} role="presentation">
                        <div id={`${viewMode}BottomBracket`} style={{ cursor: 'pointer', color: bracket === 'bottom' ? '#6a6a6a' : '#ccc', height: '30%', marginTop: viewMode === 'location' ? '10%' : '0%', transition: 'all 0.2s ease-in-out', transform: `scaleY(${viewMode === 'location' ? -1 : 1})` }}>
                            ︶
                        </div>
                    </div>
                </div>
                <div id={`${viewMode}RightCircle`} style={{ cursor: 'pointer', width: '10%', height: '100%', display: 'flex', alignItems: 'center', fontSize: '25px' }} onMouseDown={operationMouseDown({ viewMode, bracket, direction: 'right' })} onMouseUp={operationMouseUp({ viewMode, bracket, direction: 'right' })} role="presentation"> ● </div>
            </div>
            <div id={`${viewMode}BottomCircle`} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '10%', width: '100%', cursor: 'pointer', fontSize: '25px', marginLeft: '10px' }} onMouseDown={operationMouseDown({ viewMode, bracket, direction: 'bottom' })} onMouseUp={operationMouseUp({ viewMode, bracket, direction: 'bottom' })} role="presentation"> ● </div>
        </div>
    );
};

Position.propTypes = {
    viewMode: PropTypes.string.isRequired,
    bracket: PropTypes.string.isRequired,
    operationMouseDown: PropTypes.func.isRequired,
    operationMouseUp: PropTypes.func.isRequired,
    positionChangeViewMode: PropTypes.func.isRequired,
    bracketSelect: PropTypes.func.isRequired,
};

export default Position;

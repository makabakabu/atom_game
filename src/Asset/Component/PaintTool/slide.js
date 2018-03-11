import React from 'react';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import PropTypes from 'prop-types';

const Slide = ({ titleName, max, titleValue, onChange, slideObject, value }) => (
    <div style={{ height: '50px', display: 'flex', flexDirection: 'column', justifyContent: 'space-around', alignItems: 'center', marginTop: '10px' }}>
        <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>{ `${titleName}:` }</div>
            <div style={{ display: 'flex' }}>
                <input
                  style={{ border: 'none', backgroundColor: 'transparent', color: '#888', fontSize: '14px', cursor: 'pointer', width: '25px', textAlign: 'right' }}
                  value={value}
                  onChange={(event) => { if (event.target.value !== '') { onChange({ value: parseInt(event.target.value, 10), slideObject }); } }}
                />
                <div>{ titleValue.replace(value, '') }</div>
            </div>
        </div>
        <div style={{ width: '94%', marginTop: '10px' }}>
            <Slider trackStyle={[{ backgroundColor: '#aaa' }]} max={max} value={value} dotStyle={{ backgroundColor: '#aaa' }} onChange={sliderValue => onChange({ value: sliderValue, slideObject })} />
        </div>
    </div>
);

Slide.propTypes = {
    titleName: PropTypes.string.isRequired,
    max: PropTypes.number,
    titleValue: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    slideObject: PropTypes.array,
    value: PropTypes.number.isRequired,
};

Slide.defaultProps = {
    max: 100,
    slideObject: [],
};

export default Slide;

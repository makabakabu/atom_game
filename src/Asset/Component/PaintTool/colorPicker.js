import React from 'react';
import { CirclePicker } from 'react-color';
import uuidv4 from 'uuid';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import { faEyeDropper } from '@fortawesome/fontawesome-free-solid';

const ColorPicker = ({ hex, colorClick, isClick, cuvette, cuvettePick, colorPicker, kind, opacity }) => ([
    <div key={uuidv4()} style={{ height: 60, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
            颜色:
        </div>
        <div style={{ width: 60, height: 20, display: 'flex', justifyContent: 'space-between' }}>
            <div
              id="colorPickerBar"
              role="presentation"
              style={{ width: 32, height: 20, backgroundColor: `rgba(${parseInt(hex.substr(1, 2), 16)},${parseInt(hex.substr(3, 2), 16)},${parseInt(hex.substr(5, 2), 16)},${opacity})`, cursor: 'pointer', borderRadius: 3 }}
              onClick={colorClick({ kind, visibility: !isClick })}
            />
        <FontAwesomeIcon size="lg" icon={faEyeDropper} style={{ color: cuvette ? '#888' : '#aaa' }} onClick={cuvettePick} />
        </div>
    </div>,
    <div key={uuidv4()} style={{ width: 200, display: 'flex', justifyContent: 'center' }}>
        { isClick && <CirclePicker onChange={color => colorPicker({ color, kind })} color="#ededed" style={{ transition: 'all 1s ease-out' }} /> }
    </div>,
]);

export default ColorPicker;

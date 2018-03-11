import React from 'react';
import { Divider } from 'antd';
import Logo from './logo';
import Progress from './progress';
import Operation from './operation';

const Header = () => (
    <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', height: '80px', boxShadow: '0 2px 8px #f0f1f2', marginBottom: '8px' }}>
        <Logo />
        <Divider type="vertical" style={{ height: '30px' }} />
        <Progress />
        <Divider type="vertical" style={{ height: '30px' }} />
        <Operation />
    </div>
);

export default Header;

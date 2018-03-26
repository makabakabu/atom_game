import React from 'react';
import { Divider } from 'antd';
import Logo from './logo';
import Progress from './progress';
import Operation from './operation';

const Header = () => (
    <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', height: 80, boxShadow: '0 2px 8px #f0f1f2', marginBottom: 8 }}>
        <Logo />
        <Divider type="vertical" style={{ height: 30 }} />
        <Progress />
        <Divider type="vertical" style={{ height: 30 }} />
        <Operation />
    </div>
);

export default Header;

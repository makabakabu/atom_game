import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

let interval;
let angle = 0;
const Logo = ({ mouseEnter, mouseLeave }) =>
(
    <div id="logo" style={styles.logo}>
        <img
          src={require('Asset/Image/Public/name1.png')}
          alt="这是logo呀"
          style={styles.logo_word}
        />
        <img
          id="logo_img"
          src={require('Asset/Image/Public/logo.png')}
          alt="这是logo呀"
          style={styles.logo_img}
          onMouseEnter={mouseEnter}
          onMouseLeave={mouseLeave}
        />
        <img
          src={require('Asset/Image/Public/name2.png')}
          alt="这是logo呀"
          style={styles.logo_word}
        />
    </div>
);

Logo.propTypes = {
    mouseEnter: PropTypes.func.isRequired,
    mouseLeave: PropTypes.func.isRequired,
};

const styles = {
    logo: {
        height: '80px',
        width: '250px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    logo_img: {
        height: '60px',
        width: '60px',
        marginRight: '5px',
        transition: 'all 3s linear',
    },
    logo_word: {
        marginTop: '25px',
        height: '40px',
        width: '40px',
    },
};

const mapDispatchToProps = () => ({
    mouseEnter: () => {
        const logo = document.getElementById('logo_img').style;
        angle += 360;
        logo.transform = `rotate(${angle}deg)`;
        interval = setInterval(() => {
            angle += 360;
            logo.transform = `rotate(${angle}deg)`;
        }, 3000);
    },
    mouseLeave: async () => {
        clearInterval(interval);
    },
});

export default connect(null, mapDispatchToProps)(Logo);

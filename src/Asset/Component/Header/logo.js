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
        height: 80,
        width: 250,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    logo_img: {
        height: 60,
        width: 60,
        marginRight: 5,
        transition: 'all 3s linear',
    },
    logo_word: {
        marginTop: 25,
        height: 40,
        width: 40,
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

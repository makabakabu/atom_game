import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import 'antd/dist/antd.css';
import 'rc-slider/assets/index.css';
import { ApolloClient } from 'apollo-client';
import { ApolloProvider } from 'react-apollo';
import { createHttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import Header from './Asset/Component/Header/header';
import RealAsset from './Framework/RealAsset/realAsset';
import VirtualAsset from './Framework/VirtualAsset/virtualAsset';
import Action from './Framework/Action/action';
import Game from './Framework/Game/game';

const link = createHttpLink({
    uri: 'http://127.0.0.1:4000/graphql/',
    credentials: 'same-origin',
});

const client = new ApolloClient({
    link,
    cache: new InMemoryCache(),
});

const App = ({ viewMode }) => {
    const componentMap = {
        realAsset: RealAsset,
        virtualAsset: VirtualAsset,
        action: Action,
        game: Game,
    };
    const Component = componentMap[viewMode];
    return (
        <ApolloProvider client={client}>
            <div>
                <Header />
                <Component />
            </div>
        </ApolloProvider>
    );
};

App.propTypes = {
    viewMode: PropTypes.string.isRequired,
};

const mapStateToProps = state => ({
    viewMode: state.get('viewMode'),
});

export default connect(mapStateToProps)(App);

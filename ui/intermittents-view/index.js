import React from 'react';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import App from './ui/App';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/treeherder-global.css';
import '../css/intermittents-view.css';
import 'font-awesome/css/font-awesome.css';

import store from './redux/store';

const load = () => render((
    <AppContainer>
            <App store={store}/>
    </AppContainer>
), document.getElementById('root'));

if (module.hot) {
  module.hot.accept('./ui/App', load);
}

load();

import React from 'react';
import { render } from 'react-dom';
// import { Provider } from 'react-redux';
import { AppContainer } from 'react-hot-loader';
import App from './ui/App';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/treeherder-global.css';
import '../css/intermittents-view.css';
import store from './redux/store';

const load = () => render((
    <AppContainer>
        {/* <Provider store={store}> */}
            <App store={store}/>
        {/* </Provider> */}
    </AppContainer>
), document.getElementById('root'));

if (module.hot) {
  module.hot.accept('./ui/App', load);
}

load();

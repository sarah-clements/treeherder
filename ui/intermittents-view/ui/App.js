import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import IntermittentsView from './IntermittentsView';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';

const App = ({ store }) => (
    <Provider store={store}>
        <BrowserRouter>
            <div>
                <Route exact path="/intermittentsview.html" component={IntermittentsView} />
            </div>
        </BrowserRouter>
    </Provider>
);

App.propTypes = {
    store: PropTypes.object.isRequired
};

export default App;

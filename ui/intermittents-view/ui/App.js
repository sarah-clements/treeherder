import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import IntermittentsView from './IntermittentsView';
import BugDetailsView from './BugDetailsView';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';

const App = ({ store }) => (
    <Provider store={store}>
        <BrowserRouter>
            <main>
                <Switch>
                    <Route exact path="/intermittentsview.html" component={IntermittentsView} />
                    <Route path="/bugdetailsview" component={BugDetailsView} />
                </Switch>
            </main>
        </BrowserRouter>
    </Provider>
);

App.propTypes = {
    store: PropTypes.object.isRequired
};

export default App;

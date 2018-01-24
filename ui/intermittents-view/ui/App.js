import React from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import IntermittentsView from './IntermittentsView';
import BugDetailsView from './BugDetailsView';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';

const App = ({ store }) => {
    const { dates, mainTree } = store.getState();
    console.log(store.getState());
    return (
        <Provider store={store}>
            <BrowserRouter>
                <main>
                    <Route exact path="/intermittentsview.html" component={IntermittentsView} />
                    <Switch>
                        <Route path={`/intermittentsview.html?startday=${dates.ISOfrom}&endday=${dates.ISOto}&tree=${mainTree.tree}`} component={IntermittentsView} />
                        <Route path="/intermittentsview.html?startday=:startday&endday=:endday&tree=:tree" component={IntermittentsView} />
                        <Route path="/bugdetailsview" component={BugDetailsView} />
                        <Redirect from="/intermittentsview.html" to={`/intermittentsview.html?startday=${dates.ISOfrom}&endday=${dates.ISOto}&tree=${mainTree.tree}`} />
                    </Switch>
                </main>
            </BrowserRouter>
        </Provider>
    );
};

App.propTypes = {
    store: PropTypes.object.isRequired
};

export default App;

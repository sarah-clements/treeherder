import React from "react";
import { HashRouter, Route, Switch, Redirect } from "react-router-dom";
import PropTypes from "prop-types";
import { Provider } from "react-redux";
import IntermittentsView from "./IntermittentsView";
import BugDetailsView from "./BugDetailsView";

const App = ({ store }) => {
    const { dates, mainTree } = store.getState();
    let defaultPath = {
        pathname: '/main',
        search: `?startday=${dates.ISOfrom}&endday=${dates.ISOto}&tree=${mainTree.tree}`
    };
    return (
        <Provider store={store}>
            <HashRouter>
                <main>
                    <Switch>
                        <Route path="/main" component={IntermittentsView} />
                        <Route path="/main?startday=:startday&endday=:endday&tree=:tree" component={IntermittentsView} />
                        <Route path="/bugdetails" component={BugDetailsView} />
                        <Route path="/bugdetails?startday=:startday&endday=:endday&tree=:tree&bug=bug" component={BugDetailsView} />
                        <Redirect from="/" to={defaultPath} />
                    </Switch>
                </main>
            </HashRouter>
            {/* <BrowserRouter>
                <main>
                    <Switch>
                        <Route exact path="/intermittentsview.html" component={IntermittentsView} />
                        <Route path="/bugdetailsview" component={BugDetailsView} />
                    </Switch>
                </main>
            </BrowserRouter> */}
        </Provider>
    );
};

App.propTypes = {
    store: PropTypes.object.isRequired
};

export default App;

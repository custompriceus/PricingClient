import React, { useEffect, useContext, lazy, Suspense } from 'react';
import { useLocation, Redirect, Route, Switch } from 'react-router-dom';
import { StoreContext } from "../context/store/storeContext";
import SLUGS from 'resources/slugs';
import Layout from './Layout';
import LoadingComponent from 'components/loading';
import LoginComponent from './login';

const ShirtPricingComponent = lazy(() => import('./shirtpricing'));
const EmbroideryPricingComponent = lazy(() => import('./embroiderypricing'));
const PriceListComponent = lazy(() => import('./pricelist'));

// Reusable Protected Wrapper
const CheckRoute = ({ element }) => {
    const token = localStorage.getItem("userDetails")
        ? JSON.parse(localStorage.getItem("userDetails"))
        : null;

    return token?.accessToken ? element : <Redirect to={SLUGS.login} />;
};

function Routes() {
    const { state } = useContext(StoreContext);
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    return (
        <Suspense fallback={<LoadingComponent loading />}>
            <Switch>
                <Route
                    exact
                    path={SLUGS.shirtpricing}
                    render={() => (
                        <CheckRoute element={<Layout><ShirtPricingComponent /></Layout>} />
                    )}
                />
                <Route
                    exact
                    path={SLUGS.embroiderypricing}
                    render={() => (
                        <CheckRoute element={<Layout><EmbroideryPricingComponent /></Layout>} />
                    )}
                />
                <Route
                    exact
                    path={SLUGS.pricelist}
                    render={() => (
                        <CheckRoute element={<Layout><PriceListComponent /></Layout>} />
                    )}
                />
                <Route
                    exact
                    path={SLUGS.login}
                    render={() => (
                        <LoginComponent />
                    )}
                />
                
                <Route
                    exact
                    path={"/"}
                    render={() => (
                      <CheckRoute element={<Layout>
                          <ShirtPricingComponent />
                      </Layout>}
                      />
                    )}
                />
                {/* <Redirect to={SLUGS.shirtpricing} /> */}
            </Switch>
        </Suspense>
    );
}

export default Routes;

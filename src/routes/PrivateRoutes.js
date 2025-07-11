import React, { Suspense, lazy } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import SLUGS from 'resources/slugs';
import LoadingComponent from 'components/loading';

const ShirtPricingComponent = lazy(() => import('./shirtpricing'));
const EmbroideryPricingComponent = lazy(() => import('./embroiderypricing'));
const PriceListComponent = lazy(() => import('./pricelist'));

function PrivateRoutes() {
    const token = localStorage.getItem("userDetails") ? JSON.parse(localStorage.getItem("userDetails"))?.accessToken : {}
    return (
        <Suspense fallback={<LoadingComponent loading />}>
            {
                token ? <Switch>
                    <Route exact path={SLUGS.shirtpricing} component={ShirtPricingComponent} />
                    <Route exact path={SLUGS.embroiderypricing} component={EmbroideryPricingComponent} />
                    <Route exact path={SLUGS.pricelist} component={PriceListComponent} />
                    <Redirect to={SLUGS.shirtpricing} />
                </Switch> : <Redirect to={SLUGS.login} />
            }

        </Suspense>
    );
}

export default PrivateRoutes;

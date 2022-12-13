import React, { Suspense, lazy } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import SLUGS from 'resources/slugs';
import LoadingComponent from 'components/loading';

const DashboardComponent = lazy(() => import('./dashboard'));
const LeaguesComponent = lazy(() => import('./leagues'));
const DecksComponent = lazy(() => import('./decks'));
const ShirtPricingComponent = lazy(() => import('./shirtpricing'));
const EmbroideryPricingComponent = lazy(() => import('./embroiderypricing'));
const PriceListComponent = lazy(() => import('./pricelist'));

function PrivateRoutes() {
    return (
        <Suspense fallback={<LoadingComponent loading />}>
            <Switch>
                <Route exact path={SLUGS.leagues} component={LeaguesComponent} />
                <Route exact path={SLUGS.decks} component={DecksComponent} />
                <Route exact path={SLUGS.dashboard} component={DashboardComponent} />
                <Route exact path={SLUGS.overviewTwo} render={() => <div>overviewTwo</div>} />
                <Route exact path={SLUGS.overviewThree} render={() => <div>overviewThree</div>} />
                <Route exact path={SLUGS.overview} render={() => <div>overview</div>} />
                <Route exact path={SLUGS.tickets} render={() => <div>tickets</div>} />
                <Route exact path={SLUGS.ideasTwo} render={() => <div>ideasTwo</div>} />
                <Route exact path={SLUGS.ideasThree} render={() => <div>ideasThree</div>} />
                <Route exact path={SLUGS.ideas} render={() => <div>ideas</div>} />
                <Route exact path={SLUGS.contacts} render={() => <div>contacts</div>} />
                <Route exact path={SLUGS.agents} render={() => <div>agents</div>} />
                <Route exact path={SLUGS.articles} render={() => <div>articles</div>} />
                <Route exact path={SLUGS.settings} render={() => <div>settings</div>} />
                <Route exact path={SLUGS.subscription} render={() => <div>subscription</div>} />
                <Route exact path={SLUGS.shirtpricing} component={ShirtPricingComponent} />
                <Route exact path={SLUGS.embroiderypricing} component={EmbroideryPricingComponent} />
                <Route exact path={SLUGS.pricelist} component={PriceListComponent} />
                <Redirect to={SLUGS.leagues} />
            </Switch>
        </Suspense>
    );
}

export default PrivateRoutes;

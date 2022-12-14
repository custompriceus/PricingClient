import React, { Suspense, lazy } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import SLUGS from 'resources/slugs';
import LoadingComponent from 'components/loading';

const LoginComponent = lazy(() => import('./login'));

function PublicRoutes(props) {
    return (
        <Suspense fallback={<LoadingComponent loading />}>
            <Switch>
                <Route exact path={SLUGS.login} component={LoginComponent} state={props.state} setState={props.setState} />
                <Redirect to={SLUGS.login} />
            </Switch>
        </Suspense>
    );
}

export default PublicRoutes;

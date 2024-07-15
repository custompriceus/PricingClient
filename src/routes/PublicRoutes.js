import React, { Suspense, lazy } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import SLUGS from 'resources/slugs';
import LoadingComponent from 'components/loading';
import { SidebarComponent, SidebarContext } from 'components/sidebar';
import HeaderComponent from 'components/header/HeaderComponent';
import { Column, Row } from 'simple-flexbox';
import { createUseStyles, useTheme } from 'react-jss';

const ShirtPricingComponent = lazy(() => import('./shirtpricing'));
const EmbroideryPricingComponent = lazy(() => import('./embroiderypricing'));
const PriceListComponent = lazy(() => import('./pricelist'));

const useStyles = createUseStyles({
    container: {
        height: '100%',
        minHeight: 850
    },
    mainBlock: {
        marginLeft: 255,
        padding: 30,
        '@media (max-width: 1080px)': {
            marginLeft: 0
        }
    },
    contentBlock: {
        marginTop: 54
    }
});

function PublicRoutes(props) {
    const theme = useTheme();
    const classes = useStyles({ theme });
    
    return (

        <SidebarContext>
        <Row className={classes.container}>
            <SidebarComponent />
            <Column flexGrow={1} className={classes.mainBlock}>
                <HeaderComponent />
                <div className={classes.contentBlock}>
                <Suspense fallback={<LoadingComponent loading />}>
            <Switch>
            <Route exact path="/" component={ShirtPricingComponent} state={props.state} setState={props.setState} />
            <Route exact path={SLUGS.shirtpricing} component={ShirtPricingComponent} state={props.state} setState={props.setState} />
            <Route exact path={SLUGS.embroiderypricing} component={EmbroideryPricingComponent} state={props.state} setState={props.setState} />
            <Route exact path={SLUGS.pricelist} component={PriceListComponent} />
            <Redirect to={SLUGS.shirtpricing} />
                {/* <Route exact path={SLUGS.login} component={LoginComponent} state={props.state} setState={props.setState} />
                 */}
            </Switch>
        </Suspense>
                </div>
            </Column>
        </Row>
    </SidebarContext>
       
    );
}

export default PublicRoutes;

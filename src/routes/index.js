import React, { useEffect, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import useWindowSize from 'hooks/useWindowSize';
import PrivateSection from 'routes/PrivateSection';
import PublicRoutes from 'routes/PublicRoutes';
import { StoreContext } from "../context/store/storeContext";

function Routes() {
    const { state } = useContext(StoreContext);
    const { pathname } = useLocation();

    // eslint-disable-next-line no-unused-vars
    const [width, height] = useWindowSize();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    return state.generalStates.isLoggedIn ?
        <PrivateSection /> : <PublicRoutes />;
}

export default Routes;

import React, { useContext } from 'react';
import { createUseStyles, useTheme } from 'react-jss';
import { useHistory } from 'react-router-dom';
import SLUGS from 'resources/slugs';
import {
    IconAgents,
    IconArticles,
    IconContacts,
    IconIdeas,
    IconLogout,
    IconOverview,
    IconSettings,
    IconSubscription,
    IconTickets
} from 'assets/icons';
import { convertSlugToUrl } from 'resources/utilities';
import LogoComponent from './LogoComponent';
import Menu from './MenuComponent';
import MenuItem from './MenuItemComponent';
import { StoreContext } from "../../context/store/storeContext";

const useStyles = createUseStyles({
    separator: {
        borderTop: ({ theme }) => `1px solid ${theme.color.lightGrayishBlue}`,
        marginTop: 16,
        marginBottom: 16,
        opacity: 0.06
    }
});

function SidebarComponent() {
    const { push } = useHistory();
    const theme = useTheme();
    const classes = useStyles({ theme });
    const isMobile = window.innerWidth <= 1080;
    const { state, actions } = useContext(StoreContext);

    function logout() {
        actions.generalActions.logout()
    }

    function onClick(slug, parameters = {}) {
        push(convertSlugToUrl(slug, parameters));
    }

    return (
        <Menu isMobile={isMobile}>
            <div style={{ paddingTop: 30, paddingBottom: 30 }}>
                <LogoComponent />
            </div>
            <MenuItem
                id={SLUGS.shirtpricing}
                title='Screen Print Pricing'
                icon={IconSubscription}
                onClick={() => onClick(SLUGS.shirtpricing)}
            />
            <MenuItem
                id={SLUGS.embroiderypricing}
                title='Embroidery Pricing'
                icon={IconSubscription}
                onClick={() => onClick(SLUGS.embroiderypricing)}
            />
            <MenuItem
                id={SLUGS.pricelist}
                title='Price List'
                icon={IconSubscription}
                onClick={() => onClick(SLUGS.pricelist)}
            />
            <div className={classes.separator}></div>
            {/* <MenuItem
                id={SLUGS.settings}
                title='Settings'
                icon={IconSettings}
                onClick={() => onClick(SLUGS.settings)}
            />
            <MenuItem id='logout' title='Logout' icon={IconLogout} onClick={logout} /> */}
        </Menu>
    );
}

export default SidebarComponent;

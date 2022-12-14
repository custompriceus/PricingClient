import React from 'react';
import { Row } from 'simple-flexbox';
import { createUseStyles, useTheme } from 'react-jss';
import { IconLogo } from 'assets/icons';
import SLUGS from '../../resources/slugs';
import { useHistory } from 'react-router-dom';
import { convertSlugToUrl } from '../../resources/utilities';

const useStyles = createUseStyles((theme) => ({
    container: {
        marginLeft: 32,
        marginRight: 32
    },
    title: {
        ...theme.typography.cardTitle,
        color: theme.color.grayishBlue,
        opacity: 0.7,
        marginLeft: 12
    }
}));

function LogoComponent() {
    const theme = useTheme();
    const classes = useStyles({ theme });
    const { push } = useHistory();

    function onClick(slug, parameters = {}) {
        push(convertSlugToUrl(slug, parameters));
    }

    return (
        <Row onClick={() => {
            onClick(SLUGS.shirtpricing)
        }} className={classes.container} horizontal='center' vertical='center'>
            <IconLogo />
            <span className={classes.title}>Shirt Pricing</span>
        </Row>
    );
}

export default LogoComponent;

import React, { useState } from 'react';
import { Dialog, Button, DialogContent, makeStyles } from '@material-ui/core';
import LoginButton from '../LoginButton';

const useStyles = makeStyles((theme) => ({
	btn: {
		width: '100%',
		marginBottom: theme.spacing(2)
	}
}));

const LoginModal = (props) => {
	const [ open, setOpen ] = useState(false);
	const classes = useStyles();
	return (
		<React.Fragment>
			<Button {...props} onClick={() => setOpen(true)}>
				Login
			</Button>
			<Dialog open={open} onClose={() => setOpen(false)}>
				<DialogContent>
					<div>
						<LoginButton role="customer" variant="outlined" color="primary" className={classes.btn} />
					</div>
					<div>
						<LoginButton
							role="restaurant_manager"
							variant="outlined"
							color="primary"
							className={classes.btn}
						/>
					</div>
					<div>
						<LoginButton role="driver" variant="outlined" color="primary" className={classes.btn} />
					</div>
				</DialogContent>
			</Dialog>
		</React.Fragment>
	);
};

export default LoginModal;

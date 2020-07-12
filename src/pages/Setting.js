import React from 'react';
import Select from '@material-ui/core/Select';
import Typography from '@material-ui/core/Typography';
import MenuItem from '@material-ui/core/MenuItem';
import { makeStyles } from '@material-ui/core/styles';

import { useRoleContext } from '../context/RoleContext';

const useStyles = makeStyles((theme) => ({
	title: {
		marginBottom: theme.spacing(2)
	}
}));

const Setting = () => {
	const { roles, currentRole, updateRole } = useRoleContext();
	const classes = useStyles();

	const handleSelectChange = (e) => {
		updateRole(e.target.value);
	};
	return (
		<div>
			<Typography variant="h5" className={classes.title}>
				Settings
			</Typography>
			<div>
				<span>Role: </span>
				<Select onChange={handleSelectChange} value={currentRole}>
					{roles.map((role) => {
						return (
							<MenuItem key={role} value={role}>
								{role}
							</MenuItem>
						);
					})}
				</Select>
			</div>
		</div>
	);
};

export default Setting;

import React, { useState } from 'react';
import {
  Modal,
  Box,
  Typography,
  Button,
  makeStyles,
} from '@mui/material';

const useStyles = makeStyles((theme) => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

const ConfirmationModal = ({ open, onClose, onConfirm, userName }) => {
  const classes = useStyles();

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      className={classes.modal}
    >
      <div className={classes.paper}>
        <Typography variant="h6">Confirm Action</Typography>
        <Typography>
          Are you sure you want to toggle {userName}'s status?
        </Typography>
        <Box mt={2}>
          <Button onClick={handleConfirm} color="primary" variant="contained">
            Confirm
          </Button>
          <Button onClick={onClose} color="secondary" variant="outlined">
            Cancel
          </Button>
        </Box>
      </div>
    </Modal>
  );
};

export default ConfirmationModal;

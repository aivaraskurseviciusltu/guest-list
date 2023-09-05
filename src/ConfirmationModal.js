import React from 'react';
import {
    Modal,
    Backdrop,
    Fade,
    Typography,
    Button,
    Box,
    Paper,
    IconButton,
} from '@mui/material';

const ConfirmationModal = ({ open, onClose, onConfirm, userName }) => {
    return (
        <Modal
            open={open}
            onClose={onClose}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
                timeout: 500,
            }}
        >
            <Fade in={open}>
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                    }}
                >
                    <Paper
                        elevation={3}
                        style={{
                            padding: '16px',
                            minWidth: '250px',
                            maxWidth: '400px',
                            textAlign: 'center',
                        }}
                    >
                        <Typography variant="h6" gutterBottom>
                            Ar tikrai atėjo
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                            <b>{userName}</b> ?
                        </Typography>
                        <Box marginTop={2} display="flex" justifyContent="center" sx={{ gap: 2 }}>
                            <Button variant="outlined" onClick={onClose}>
                                Ne
                            </Button>
                            <Button variant="contained" color="primary" onClick={onConfirm}>
                                Taip
                            </Button>
                        </Box>
                    </Paper>
                </div>
            </Fade>
        </Modal>
    );
};

export default ConfirmationModal;

import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { Divider } from '@mui/material';
import { maxWidth, sizing } from '@mui/system';


const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    maxWidth: 'lg',
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
  };

export default function crear (props) {
    const {pops, handleClose, children} = props;

  return (
    <div>
      <Modal
        open={pops}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Crear Producto
          </Typography>
          <Divider/>
          
            {children}
            <strong>
                <Button
                    variant="contained"
                    color="primary"
                    //style={{ marginLeft: 16 }}
                    sx= {{backgroundColor:'black', mt: 2}}
                    onClick={handleClose}
                >
                    Cancelar
                </Button>
            </strong>
        </Box>
      </Modal>
    </div>
  );
}

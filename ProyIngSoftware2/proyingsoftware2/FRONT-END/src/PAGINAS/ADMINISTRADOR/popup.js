import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { Divider } from '@mui/material';
import { maxWidth, sizing } from '@mui/system';
import Crea from '../ADMINISTRADOR/Crea'
import Popup from '../ADMINISTRADOR/popup2';
import RefreshIcon from '@mui/icons-material/Refresh';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  maxWidth: 'xl',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};

export default function BasicModal(props) {
    const {pop, handleClose, children, handleUpdate} = props;
    const [pops, setpops ] = useState(false);
    const handleOpenPop = () => setpops(true);
    const handleClosePop = () => setpops(false);
    
  return (
    <div>
      <Modal
        open={pop}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Busqueda de Producto
          </Typography>
          <Divider/>
          <Box display="flex" justifyContent="space-between" alignItems="center">
          
            <Button
                      variant="contained"
                      color="primary"
                      //style={{ marginLeft: 16 }}
                      sx= {{backgroundColor:'black', mt: 2, mb:2}}
                      onClick={handleOpenPop}
                  >
                      Crear Producto
                  </Button>
                  <Button
                    variant="contained"
                      color="primary"
                      //style={{ marginLeft: 16 }}
                      sx= {{backgroundColor:'black', mt: 2, mb:2}}
                      onClick={handleUpdate}
                      
                      >
                        <RefreshIcon/>
                  </Button>
            </Box>
                <Popup
                  pops = {pops}
                  handleClose = {handleClosePop}
                >
                  <Crea />

                </Popup>
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
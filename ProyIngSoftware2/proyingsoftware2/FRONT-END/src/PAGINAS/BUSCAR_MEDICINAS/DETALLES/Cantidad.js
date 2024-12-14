import React from 'react';
import { Box, IconButton, TextField, Typography } from '@mui/material';
import { Add, Remove } from '@mui/icons-material';
import PropTypes from 'prop-types';

const CantidadProducto = ({ cantidad, aumentar, disminuir }) => {
  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      <Typography variant="body2">CANTIDAD:</Typography>
      <Box display="flex" alignItems="center">
        <IconButton onClick={disminuir}>
          <Remove />
        </IconButton>
        <TextField
          variant="outlined"
          size="small"
          value={cantidad}
          inputProps={{ style: { textAlign: 'center' }, readOnly: true }}
          style={{ width: 50 }}
        />
        <IconButton onClick={aumentar}>
          <Add />
        </IconButton>
      </Box>
    </Box>
  );
};

CantidadProducto.propTypes = {
  cantidad: PropTypes.number.isRequired,
  aumentar: PropTypes.func.isRequired,
  disminuir: PropTypes.func.isRequired,
};

export default CantidadProducto;
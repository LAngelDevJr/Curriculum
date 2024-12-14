import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, TextField, IconButton  } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const BarradeBusqueda = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSearch = () => {
    navigate(`/ResultadoBusqueda`, { state: { query: searchTerm } });
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1, maxWidth: '370px', backgroundColor:'white', borderRadius: '20px' }}>
      <TextField
        variant="outlined"
        placeholder="Busca productos por nombre..."
        fullWidth
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyDown={handleKeyDown}
        InputProps={{
          endAdornment: (
            <IconButton
              onClick={handleSearch}
              sx={{ 
                borderRadius: '50%',
                backgroundColor: '#d7e8ff', 
                '&:hover': {
                  backgroundColor: '#5f9fbf', 
                },
                width: '40px', 
                height: '30px', 
                padding: '0', 
                marginLeft: 1, 
                border: 'none',         
              }}
            >
              <SearchIcon sx={{ color: '#1f364c' }} />
            </IconButton>
          ),
        }}
        sx={{ 
            flexGrow: 1, 
            '& .MuiOutlinedInput-root': { 
              borderRadius: '20px', 
            },
            '& .MuiInputBase-input': {
              height: '40px', 
              padding: '0 14px', 
            },
          }}
        />
      </Box>
    );
  };
  
  export default BarradeBusqueda;

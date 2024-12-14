import PropTypes from 'prop-types';
import { Grid, Paper, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';

const ContenidoPaginaBusqueda = (props) => {
  const { caractProducto } = props;

  return (
    <Grid item xs={12} sm={6} md={3}>
      <Link
        to={`/detalles/${caractProducto.id}`}
        style={{ textDecoration: 'none' }}
      >
        <Paper
          sx={{
            height: '400px',
            width: '250px',
            backgroundColor: 'white',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.1)',
            padding: '20px',
            borderRadius: '10px'
          }}
          elevation={3}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '180px',
              marginBottom: '10px',
            }}
          >
            <img
              src={caractProducto.image}
              alt={caractProducto.name}
              style={{
                maxHeight: '100%',
                maxWidth: '100%',
                objectFit: 'contain',
              }}
            />
          </div>

          <Typography
            variant="caption"
            component="div"
            sx={{
              fontWeight: 'bold',
              color: '#888',
              marginBottom: '5px',
            }}
          >
            {caractProducto.marca}
          </Typography>

          <Typography
            variant="h6"
            component="div"
            sx={{
              fontWeight: 'bold',
              marginBottom: '5px',
              textAlign: 'left',
              fontSize: '16px',
            }}
          >
            {caractProducto.name}
          </Typography>

          <Typography
            variant="body2"
            component="div"
            sx={{
              color: '#888',
              marginBottom: '10px',
            }}
          >
            Por {caractProducto.botica}
          </Typography>

          <Typography
            variant="h6"
            component="div"
            sx={{
              color: '#4CAF50',
              fontWeight: 'bold',
              fontSize: '18px',
              marginBottom: '30px',
            }}
          >
            S/. {caractProducto.precio.toFixed(2)}
          </Typography>

          <Button
            variant="contained"
            color="primary"
            sx={{
              borderRadius: '20px',
              backgroundColor: '#5f9fbf',
              width: '80%', 
              padding: '8px 16px', 
              margin: '0 auto', 
            }}
          >
            VER MÁS
          </Button>
        </Paper>
      </Link>
    </Grid>
  );
};

ContenidoPaginaBusqueda.propTypes = {
  caractProducto: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    name: PropTypes.string.isRequired,
    marca: PropTypes.string.isRequired, 
    botica: PropTypes.string.isRequired, 
    image: PropTypes.string.isRequired,
    precio: PropTypes.number.isRequired,
  }).isRequired,
};

export default ContenidoPaginaBusqueda;

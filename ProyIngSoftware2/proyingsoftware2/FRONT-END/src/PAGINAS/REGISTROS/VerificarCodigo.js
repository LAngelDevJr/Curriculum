import React, { useState } from 'react';
import { TextField, Button, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Header2 from '../../COMPONENTES/Header_2';

const VerificarCodigo = () => {
    const [codigo, setCodigo] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    
    const handleVerificarCodigo = async () => {
        if (!codigo.trim()) {
            setErrorMessage('Por favor, ingrese el código de verificación');
            return;
        }
        const correo = localStorage.getItem('correo');
        const usuario = JSON.parse(localStorage.getItem('usuario'));
        if (!correo) {
        setErrorMessage('No se encontró el correo en el almacenamiento');
        return;
        }
        try {
            const response = await fetch('http://localhost:4000/api/usuarios/verificarCodigo', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nombre: usuario.nombre,
                    apellidoPaterno: usuario.apellidoPaterno,
                    apellidoMaterno: usuario.apellidoMaterno,
                    password: usuario.password,
                    codigo:codigo, 
                    correo:correo,
                    telefono: usuario.telefono,
                    dni: usuario.dni
                 }),              
            });

            if (response.ok) {
                alert("Se ha verificado su cuenta de forma exitosa");
                console.log('Código verificado exitosamente');
                navigate('/InicioSesion');
            } else {
                const errorData = await response.json();
                setErrorMessage(errorData.message || 'Código inválido o expirado');
            }
        } catch (error) {
            setErrorMessage('Hubo un problema al verificar el código, intente nuevamente');
            console.error('Error en la solicitud:', error);
        }
    };

    return (
        <>
            <Header2 />
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '80vh',
                    padding: 2,
                }}>
                <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>
                    Verificar Código de Registro
                </Typography>
                <TextField
                    label="Ingrese código de verificación"
                    variant="outlined"
                    fullWidth
                    value={codigo}
                    onChange={(e) => setCodigo(e.target.value)}
                    sx={{ mb: 3, maxWidth: '400px' }}
                />
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleVerificarCodigo}
                    sx={{ mb: 2, borderRadius: '50px' }}>
                    Verificar código
                </Button>
                {errorMessage && (
                    <Typography color="error" sx={{ mt: 2 }}>
                        {errorMessage}
                    </Typography>
                )}
            </Box>
        </>
    );
};

export default VerificarCodigo;

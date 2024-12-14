import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './PerfilUserCss.css';
import Header1 from '../../COMPONENTES/Header_Principal';
import Footer from '../../COMPONENTES/Footer_Principal';

const PerfilUsuario = () => {
  const { id } = useParams();
  const [usuario, setUsuario] = useState(null);
  const [nuevaDireccion, setNuevaDireccion] = useState('');
  const [direccionEditada, setDireccionEditada] = useState('');
  const [direccionAEditar, setDireccionAEditar] = useState(null); // Dirección que se está editando
  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');

  // Cargar datos del usuario al montar el componente
  useEffect(() => {
    console.log("ID del usuario:", id);
    const fetchUsuario = async () => {
      try {
        const response = await fetch(`http://localhost:4000/api/usuarios/${id}`);
        if (!response.ok) throw new Error('Usuario no encontrado');
        const data = await response.json();
        setUsuario(data);
      } catch (error) {
        console.error(error);
        setError('Error al cargar datos del usuario');
      }
    };

    fetchUsuario();
  }, [id]);

  // Función para manejar la adición de una nueva dirección
  const agregarDireccion = async () => {
    const direccion = nuevaDireccion.trim();
    if (!direccion) {
      setError('Por favor ingresa una dirección');
      return;
    }

    if (usuario.direcciones.length >= 3) {
      setError('Ya has alcanzado el límite de 3 direcciones.');
      return;
    }

    try {
      const response = await fetch(`http://localhost:4000/api/usuarios/${id}/direcciones`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nuevaDireccion: direccion }),
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('Error en la respuesta:', errorData);
        setError('Error al agregar dirección');
        return;
      }

      const data = await response.json();
      setUsuario((prevUsuario) => ({
        ...prevUsuario,
        direcciones: data.direcciones,
      }));

      setMensaje('Dirección añadida correctamente');
      setNuevaDireccion('');
      setError('');
    } catch (error) {
      console.error('Error en la solicitud:', error);
      setError('Error al agregar la dirección');
    }
  };

  // Función para eliminar una dirección
  const eliminarDireccion = async (direccionIndex) => {
    console.log(`Intentando eliminar dirección en índice: ${direccionIndex}`);

    try {
        const response = await fetch(`http://localhost:4000/api/usuarios/${id}/direcciones/${direccionIndex}`, {
            method: 'DELETE',
        });

        console.log("Respuesta del backend:", response);

        if (!response.ok) {
            const errorResponse = await response.json();
            console.error("Error del backend:", errorResponse);
            throw new Error(errorResponse.error || 'Error al eliminar la dirección');
        }

        const data = await response.json();
        console.log("Direcciones después de eliminar:", data.direcciones);

        setUsuario((prevUsuario) => ({
            ...prevUsuario,
            direcciones: data.direcciones,
        }));

        setMensaje('Dirección eliminada correctamente');
        setError('');
    } catch (error) {
        console.error("Error al eliminar la dirección:", error.message);
        setError(error.message || 'Error al eliminar la dirección');
    }
};





  // Función para manejar la edición de una dirección
  const actualizarDireccion = async () => {
    console.log(`Editando dirección: ${direccionAEditar} a ${direccionEditada}`);

    if (!direccionAEditar || !direccionEditada.trim()) {
        setError('Por favor ingresa una dirección válida para actualizar');
        return;
    }

    const direccionIndex = usuario.direcciones.indexOf(direccionAEditar);
    console.log(`Índice de la dirección a editar: ${direccionIndex}`);

    if (direccionIndex === -1) {
        setError('Dirección no encontrada');
        return;
    }

    try {
        const response = await fetch(`http://localhost:4000/api/usuarios/${id}/direcciones/${direccionIndex}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nuevaDireccion: direccionEditada.trim() }),
        });

        console.log("Respuesta del backend:", response);

        if (!response.ok) {
            const errorResponse = await response.json();
            console.error("Error del backend:", errorResponse);
            throw new Error(errorResponse.error || 'Error al actualizar la dirección');
        }

        const data = await response.json();
        console.log("Direcciones después de editar:", data.direcciones);

        setUsuario((prevUsuario) => ({
            ...prevUsuario,
            direcciones: data.direcciones,
        }));

        setMensaje('Dirección actualizada correctamente');
        setDireccionEditada('');
        setDireccionAEditar(null);
        setError('');
    } catch (error) {
        console.error("Error al actualizar la dirección:", error.message);
        setError(error.message || 'Error al actualizar la dirección');
    }
};



  return (
    <>
      <Header1 />
      <div className='ContenedorUser'>
        {usuario ? (
          <div>
            <h1>
              {usuario.nombre} {usuario.apellidoPaterno} {usuario.apellidoMaterno}
            </h1>
            <p>Correo: {usuario.correo}</p>
            <p>Teléfono: {usuario.telefono}</p>
            <p>DNI: {usuario.dni}</p>
            <p>Te uniste el: {usuario.fechaRegistro}</p>

            <h3>Direcciones</h3>
            {usuario.direcciones && usuario.direcciones.length > 0 ? (
              usuario.direcciones.map((direccion, index) => (
                <div key={index} className="direccion-item">
                  <p>{direccion}</p>
                  <button onClick={() => eliminarDireccion(index)}>Eliminar</button>
                  <button onClick={() => setDireccionAEditar(direccion)}>Editar</button>
                </div>
              ))
            ) : (
              <p>No hay direcciones registradas.</p>
            )}

            {direccionAEditar && (
              <div className="editar-direccion">
                <input
                  type="text"
                  value={direccionEditada}
                  onChange={(e) => setDireccionEditada(e.target.value)}
                  placeholder="Edita la dirección"
                />
                <button onClick={actualizarDireccion}>Actualizar Dirección</button>
              </div>
            )}

            <div className="agregar-direccion">
              <input
                type="text"
                value={nuevaDireccion}
                onChange={(e) => setNuevaDireccion(e.target.value)}
                placeholder="Ingresa una nueva dirección"
              />
              <button onClick={agregarDireccion}>Agregar Dirección</button>
            </div>

            {error && <p className="error">{error}</p>}
            {mensaje && <p className="mensaje">{mensaje}</p>}
          </div>
        ) : (
          <p>Cargando...</p>
        )}
      </div>
      <Footer />
    </>
  );
};

export default PerfilUsuario;



'use client'

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('usuarios');
  const [usuarios, setUsuarios] = useState([]);
  const [loadingUsuarios, setLoadingUsuarios] = useState(false);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [editandoUsuario, setEditandoUsuario] = useState(null);
  const [formularioData, setFormularioData] = useState({
    nombre: '',
    apellido: '',
    correo: '',
    contraseña: '',
    rol: 'Usuario',
    estado: 'Anzoátegui'
  });
  
  // Estados para noticias
  const [noticias, setNoticias] = useState([]);
  const [loadingNoticias, setLoadingNoticias] = useState(false);
  const [mostrarFormularioNoticia, setMostrarFormularioNoticia] = useState(false);
  const [editandoNoticia, setEditandoNoticia] = useState(null);
  const [formularioNoticia, setFormularioNoticia] = useState({
    titulo: '',
    descripcion: '',
    imagen: null
  });

  // Estados para eventos
  const [eventos, setEventos] = useState([]);
  const [loadingEventos, setLoadingEventos] = useState(false);
  const [mostrarFormularioEvento, setMostrarFormularioEvento] = useState(false);
  const [editandoEvento, setEditandoEvento] = useState(null);
  const [formularioEvento, setFormularioEvento] = useState({
    titulo: '',
    descripcion: '',
    fechaEvento: '',
    horaEvento: '',
    imagen: null
  });

  // Estados para empresas
  const [empresas, setEmpresas] = useState([]);
  const [loadingEmpresas, setLoadingEmpresas] = useState(false);
  const [mostrarFormularioEmpresa, setMostrarFormularioEmpresa] = useState(false);
  const [editandoEmpresa, setEditandoEmpresa] = useState(null);
  const [formularioEmpresa, setFormularioEmpresa] = useState({
    nombre: '',
    region: '',
    sector: '',
    descripcion: '',
    telefono: '',
    correo: '',
    logo: null,
    imagenes: []
  });
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (activeSection === 'usuarios') {
      cargarUsuarios();
    } else if (activeSection === 'noticias') {
      cargarNoticias();
    } else if (activeSection === 'eventos') {
      cargarEventos();
    } else if (activeSection === 'empresas') {
      cargarEmpresas();
    }
  }, [activeSection]);

  const checkAuth = async () => {
    try {
      console.log('Verificando autenticación...');
      
      // Verificar si hay cookies
      console.log('Document cookies:', document.cookie);
      
      const response = await fetch('/api/auth/verify');
      console.log('Response status:', response.status);
      
      if (response.ok) {
        const userData = await response.json();
        console.log('User data:', userData);
        
        if (userData.user) {
          setUser(userData.user);
        } else {
          // Fallback: si no está en userData.user, usar los datos directamente
          setUser({
            nombre: userData.nombre,
            email: userData.email || userData.correo,
            userId: userData.userId
          });
        }
      } else {
        console.log('Auth failed, redirecting...');
        router.push('/acceder');
      }
    } catch (error) {
      console.error('Error verificando autenticación:', error);
      router.push('/acceder');
    } finally {
      setLoading(false);
    }
  };

  const cargarUsuarios = async () => {
    setLoadingUsuarios(true);
    try {
      console.log('Cargando usuarios...');
      const response = await fetch('/api/usuarios');
      console.log('Response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Usuarios recibidos:', data);
        setUsuarios(data.usuarios || []);
      } else {
        console.error('Error cargando usuarios, status:', response.status);
        const errorData = await response.text();
        console.error('Error data:', errorData);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoadingUsuarios(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/acceder');
    } catch (error) {
      console.error('Error cerrando sesión:', error);
    }
  };

  const abrirFormulario = (usuario = null) => {
    if (usuario) {
      setEditandoUsuario(usuario);
      setFormularioData({
        nombre: usuario.nombre || usuario.Nombre || '',
        apellido: usuario.apellido || usuario.Apellido || '',
        correo: usuario.correo || usuario.Correo || usuario.email || '',
        contraseña: '',
        rol: usuario.rol || 'Usuario',
        estado: usuario.estado || 'Anzoátegui'
      });
    } else {
      setEditandoUsuario(null);
      setFormularioData({
        nombre: '',
        apellido: '',
        correo: '',
        contraseña: '',
        rol: 'Usuario',
        estado: 'Anzoátegui'
      });
    }
    setMostrarFormulario(true);
  };

  const cerrarFormulario = () => {
    setMostrarFormulario(false);
    setEditandoUsuario(null);
    setFormularioData({
      nombre: '',
      apellido: '',
      correo: '',
      contraseña: '',
      rol: 'Usuario',
      estado: 'Anzoátegui'
    });
  };

  const guardarUsuario = async (e) => {
    e.preventDefault();
    setLoadingUsuarios(true);

    try {
      let response;
      if (editandoUsuario) {
        // Actualizar usuario existente
        response = await fetch(`/api/usuarios/${editandoUsuario._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formularioData)
        });
      } else {
        // Crear nuevo usuario
        response = await fetch('/api/usuarios', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formularioData)
        });
      }

      if (response.ok) {
        await cargarUsuarios();
        cerrarFormulario();
        alert(editandoUsuario ? 'Usuario actualizado exitosamente' : 'Usuario creado exitosamente');
      } else {
        const error = await response.json();
        alert(error.error || 'Error al guardar usuario');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al guardar usuario');
    } finally {
      setLoadingUsuarios(false);
    }
  };

  const eliminarUsuario = async (usuarioId) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
      return;
    }

    setLoadingUsuarios(true);
    try {
      const response = await fetch(`/api/usuarios/${usuarioId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        await cargarUsuarios();
        alert('Usuario eliminado exitosamente');
      } else {
        const error = await response.json();
        alert(error.error || 'Error al eliminar usuario');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al eliminar usuario');
    } finally {
      setLoadingUsuarios(false);
    }
  };

  // Funciones para noticias
  const cargarNoticias = async () => {
    setLoadingNoticias(true);
    try {
      const response = await fetch('/api/noticias');
      if (response.ok) {
        const data = await response.json();
        setNoticias(data.noticias || []);
      } else {
        console.error('Error cargando noticias');
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoadingNoticias(false);
    }
  };

  const abrirFormularioNoticia = (noticia = null) => {
    if (noticia) {
      setEditandoNoticia(noticia);
      setFormularioNoticia({
        titulo: noticia.titulo || '',
        descripcion: noticia.descripcion || '',
        imagen: null // No prellenamos la imagen en edición
      });
    } else {
      setEditandoNoticia(null);
      setFormularioNoticia({
        titulo: '',
        descripcion: '',
        imagen: null
      });
    }
    setMostrarFormularioNoticia(true);
  };

  const cerrarFormularioNoticia = () => {
    setMostrarFormularioNoticia(false);
    setEditandoNoticia(null);
    setFormularioNoticia({
      titulo: '',
      descripcion: '',
      imagen: null
    });
  };

  const guardarNoticia = async (e) => {
    e.preventDefault();
    setLoadingNoticias(true);

    try {
      // Preparar FormData para enviar archivo si existe
      const formData = new FormData();
      formData.append('titulo', formularioNoticia.titulo);
      formData.append('descripcion', formularioNoticia.descripcion);
      // Construir nombre completo del usuario
      const nombreCompleto = `${user?.nombre || user?.Nombre || 'Usuario'} ${user?.apellido || user?.Apellido || ''}`.trim();
      formData.append('autor', nombreCompleto);
      
      if (formularioNoticia.imagen) {
        formData.append('imagen', formularioNoticia.imagen);
      }

      let response;
      if (editandoNoticia) {
        response = await fetch(`/api/noticias/${editandoNoticia._id}`, {
          method: 'PUT',
          body: formData
        });
      } else {
        response = await fetch('/api/noticias', {
          method: 'POST',
          body: formData
        });
      }

      if (response.ok) {
        await cargarNoticias();
        cerrarFormularioNoticia();
        alert(editandoNoticia ? 'Noticia actualizada exitosamente' : 'Noticia creada exitosamente');
      } else {
        const error = await response.json();
        alert(error.error || 'Error al guardar noticia');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al guardar noticia');
    } finally {
      setLoadingNoticias(false);
    }
  };

  const eliminarNoticia = async (noticiaId) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta noticia?')) {
      return;
    }

    setLoadingNoticias(true);
    try {
      const response = await fetch(`/api/noticias/${noticiaId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        await cargarNoticias();
        alert('Noticia eliminada exitosamente');
      } else {
        const error = await response.json();
        alert(error.error || 'Error al eliminar noticia');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al eliminar noticia');
    } finally {
      setLoadingNoticias(false);
    }
  };

  // Funciones para eventos
  const cargarEventos = async () => {
    setLoadingEventos(true);
    try {
      const response = await fetch('/api/eventos');
      if (response.ok) {
        const data = await response.json();
        setEventos(data.eventos || []);
      } else {
        console.error('Error cargando eventos');
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoadingEventos(false);
    }
  };

  const abrirFormularioEvento = (evento = null) => {
    if (evento) {
      setEditandoEvento(evento);
      setFormularioEvento({
        titulo: evento.titulo || '',
        descripcion: evento.descripcion || '',
        fechaEvento: evento.fechaEvento ? evento.fechaEvento.split('T')[0] : '',
        horaEvento: evento.horaEvento || '',
        imagen: null // No prellenamos la imagen en edición
      });
    } else {
      setEditandoEvento(null);
      setFormularioEvento({
        titulo: '',
        descripcion: '',
        fechaEvento: '',
        horaEvento: '',
        imagen: null
      });
    }
    setMostrarFormularioEvento(true);
  };

  const cerrarFormularioEvento = () => {
    setMostrarFormularioEvento(false);
    setEditandoEvento(null);
    setFormularioEvento({
      titulo: '',
      descripcion: '',
      fechaEvento: '',
      horaEvento: '',
      imagen: null
    });
  };

  const guardarEvento = async (e) => {
    e.preventDefault();
    setLoadingEventos(true);

    try {
      // Preparar FormData para enviar archivo si existe
      const formData = new FormData();
      formData.append('titulo', formularioEvento.titulo);
      formData.append('descripcion', formularioEvento.descripcion);
      formData.append('fechaEvento', formularioEvento.fechaEvento);
      formData.append('horaEvento', formularioEvento.horaEvento);
      
      // Construir nombre completo del usuario
      const nombreCompleto = `${user?.nombre || user?.Nombre || 'Usuario'} ${user?.apellido || user?.Apellido || ''}`.trim();
      formData.append('organizador', nombreCompleto);
      
      // Agregar estado automáticamente del usuario
      formData.append('estado', user?.estado || 'Anzoátegui');
      
      if (formularioEvento.imagen) {
        formData.append('imagen', formularioEvento.imagen);
      }

      let response;
      if (editandoEvento) {
        response = await fetch(`/api/eventos/${editandoEvento._id}`, {
          method: 'PUT',
          body: formData
        });
      } else {
        response = await fetch('/api/eventos', {
          method: 'POST',
          body: formData
        });
      }

      if (response.ok) {
        await cargarEventos();
        cerrarFormularioEvento();
        alert(editandoEvento ? 'Evento actualizado exitosamente' : 'Evento creado exitosamente');
      } else {
        const error = await response.json();
        alert(error.error || 'Error al guardar evento');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al guardar evento');
    } finally {
      setLoadingEventos(false);
    }
  };

  const eliminarEvento = async (eventoId) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este evento?')) {
      return;
    }

    setLoadingEventos(true);
    try {
      const response = await fetch(`/api/eventos/${eventoId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        await cargarEventos();
        alert('Evento eliminado exitosamente');
      } else {
        const error = await response.json();
        alert(error.error || 'Error al eliminar evento');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al eliminar evento');
    } finally {
      setLoadingEventos(false);
    }
  };

  const toggleCancelarEvento = async (eventoId, estaCancelado) => {
    const accion = estaCancelado ? 'reactivar' : 'cancelar';
    const mensaje = estaCancelado 
      ? '¿Estás seguro de que quieres reactivar este evento?' 
      : '¿Estás seguro de que quieres cancelar este evento?';
    
    if (!confirm(mensaje)) {
      return;
    }

    setLoadingEventos(true);
    try {
      const response = await fetch(`/api/eventos/${eventoId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cancelado: !estaCancelado,
          fechaModificacion: new Date()
        })
      });

      if (response.ok) {
        await cargarEventos();
        alert(`Evento ${estaCancelado ? 'reactivado' : 'cancelado'} exitosamente`);
      } else {
        const error = await response.json();
        alert(error.error || `Error al ${accion} evento`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert(`Error al ${accion} evento`);
    } finally {
      setLoadingEventos(false);
    }
  };

  // Funciones para empresas
  const cargarEmpresas = async () => {
    setLoadingEmpresas(true);
    try {
      const response = await fetch('/api/empresas');
      if (response.ok) {
        const data = await response.json();
        setEmpresas(data.empresas || []);
      } else {
        console.error('Error cargando empresas');
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoadingEmpresas(false);
    }
  };

  const abrirFormularioEmpresa = (empresa = null) => {
    if (empresa) {
      setEditandoEmpresa(empresa);
      setFormularioEmpresa({
        nombre: empresa.nombre || '',
        region: empresa.region || '',
        sector: empresa.sector || '',
        descripcion: empresa.descripcion || '',
        telefono: empresa.telefono || '',
        correo: empresa.correo || '',
        logo: null, // No prellenamos la imagen en edición
        imagenes: []
      });
    } else {
      setEditandoEmpresa(null);
      setFormularioEmpresa({
        nombre: '',
        region: '',
        sector: '',
        descripcion: '',
        telefono: '',
        correo: '',
        logo: null,
        imagenes: []
      });
    }
    setMostrarFormularioEmpresa(true);
  };

  const cerrarFormularioEmpresa = () => {
    setMostrarFormularioEmpresa(false);
    setEditandoEmpresa(null);
    setFormularioEmpresa({
      nombre: '',
      region: '',
      sector: '',
      descripcion: '',
      telefono: '',
      correo: '',
      logo: null,
      imagenes: []
    });
  };

  const guardarEmpresa = async (e) => {
    e.preventDefault();
    setLoadingEmpresas(true);

    try {
      // Preparar FormData para enviar archivo si existe
      const formData = new FormData();
      formData.append('nombre', formularioEmpresa.nombre);
      formData.append('region', formularioEmpresa.region);
      formData.append('sector', formularioEmpresa.sector);
      formData.append('descripcion', formularioEmpresa.descripcion);
      formData.append('telefono', formularioEmpresa.telefono);
      formData.append('correo', formularioEmpresa.correo);
      
      if (formularioEmpresa.logo) {
        formData.append('logo', formularioEmpresa.logo);
      }

      // Agregar múltiples imágenes a la galería
      if (formularioEmpresa.imagenes && formularioEmpresa.imagenes.length > 0) {
        console.log('Dashboard - Agregando imágenes al FormData:', formularioEmpresa.imagenes.length, 'archivos');
        for (let i = 0; i < formularioEmpresa.imagenes.length; i++) {
          console.log(`Dashboard - Imagen ${i}:`, formularioEmpresa.imagenes[i].name, formularioEmpresa.imagenes[i].type);
          formData.append('imagenes', formularioEmpresa.imagenes[i]);
        }
      } else {
        console.log('Dashboard - No hay imágenes para agregar');
      }

      // Debug: Mostrar todo el contenido del FormData
      console.log('Dashboard - FormData que se enviará:');
      for (let pair of formData.entries()) {
        console.log(pair[0], pair[1]);
      }

      let response;
      if (editandoEmpresa) {
        console.log('Dashboard - Editando empresa, enviando PUT a:', `/api/empresas/${editandoEmpresa._id}`);
        response = await fetch(`/api/empresas/${editandoEmpresa._id}`, {
          method: 'PUT',
          body: formData
        });
      } else {
        response = await fetch('/api/empresas', {
          method: 'POST',
          body: formData
        });
      }

      if (response.ok) {
        await cargarEmpresas();
        cerrarFormularioEmpresa();
        alert(editandoEmpresa ? 'Empresa actualizada exitosamente' : 'Empresa creada exitosamente');
      } else {
        const error = await response.json();
        alert(error.error || 'Error al guardar empresa');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al guardar empresa');
    } finally {
      setLoadingEmpresas(false);
    }
  };

  const eliminarEmpresa = async (empresaId) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta empresa?')) {
      return;
    }

    setLoadingEmpresas(true);
    try {
      const response = await fetch(`/api/empresas/${empresaId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        await cargarEmpresas();
        alert('Empresa eliminada exitosamente');
      } else {
        const error = await response.json();
        alert(error.error || 'Error al eliminar empresa');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al eliminar empresa');
    } finally {
      setLoadingEmpresas(false);
    }
  };

  // Función temporal para agregar imágenes de prueba
  const agregarImagenesPrueba = async (empresaId) => {
    if (!confirm('¿Agregar imágenes de prueba a esta empresa?')) {
      return;
    }

    try {
      // Llamar a una API que agregue imágenes de prueba
      const response = await fetch(`/api/empresas/${empresaId}/test-images`, {
        method: 'POST'
      });

      if (response.ok) {
        await cargarEmpresas();
        alert('Imágenes de prueba agregadas exitosamente');
      } else {
        alert('Error al agregar imágenes de prueba');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al agregar imágenes de prueba');
    }
  };



  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '18px',
        background: '#f5f5f5'
      }}>
        Cargando dashboard...
      </div>
    );
  }

  if (!user) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '18px'
      }}>
        Redirigiendo...
      </div>
    );
  }

  const renderContent = () => {
    switch (activeSection) {
      case 'usuarios':
        return (
          <div>
            <div style={{ marginBottom: '30px' }}>
              <h1 style={{ fontSize: '28px', fontWeight: '600', color: '#333', margin: '0 0 10px 0' }}>
                Gestión de Usuarios
              </h1>
              <p style={{ color: '#666', margin: '0' }}>
                Administra los usuarios del sistema
              </p>
            </div>
            
            <div style={{
              background: 'white',
              borderRadius: '8px',
              padding: '30px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ margin: '0' }}>Lista de Usuarios</h3>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button 
                    onClick={() => abrirFormulario()}
                    style={{
                      backgroundColor: '#28a745',
                      color: 'white',
                      border: 'none',
                      padding: '10px 20px',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px'
                    }}
                  >
                    <span>➕</span> Nuevo Usuario
                  </button>
                  <button 
                    onClick={cargarUsuarios}
                    style={{
                      backgroundColor: '#d2691e',
                      color: 'white',
                      border: 'none',
                      padding: '10px 20px',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    🔄 Actualizar
                  </button>
                </div>
              </div>
              
              {loadingUsuarios ? (
                <p>Cargando usuarios...</p>
              ) : usuarios.length > 0 ? (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ backgroundColor: '#f8f9fa' }}>
                        <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Nombre</th>
                        <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Apellido</th>
                        <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Email</th>
                        <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Rol</th>
                        <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Estado</th>
                        <th style={{ padding: '12px', textAlign: 'center', borderBottom: '2px solid #dee2e6' }}>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {usuarios.map((usuario, index) => (
                        <tr key={usuario._id || index} style={{ borderBottom: '1px solid #dee2e6' }}>
                          <td style={{ padding: '12px' }}>{usuario.nombre || usuario.Nombre || 'Sin nombre'}</td>
                          <td style={{ padding: '12px' }}>{usuario.apellido || usuario.Apellido || 'Sin apellido'}</td>
                          <td style={{ padding: '12px' }}>{usuario.correo || usuario.Correo || usuario.email || 'Sin email'}</td>
                          <td style={{ padding: '12px' }}>
                            <span style={{
                              padding: '4px 8px',
                              backgroundColor: usuario.rol === 'Admin' ? '#dc3545' : '#6c757d',
                              color: 'white',
                              borderRadius: '4px',
                              fontSize: '12px'
                            }}>
                              {usuario.rol || 'Usuario'}
                            </span>
                          </td>
                          <td style={{ padding: '12px' }}>
                            <span style={{
                              padding: '4px 8px',
                              backgroundColor: '#17a2b8',
                              color: 'white',
                              borderRadius: '4px',
                              fontSize: '12px'
                            }}>
                              {usuario.estado || 'Anzoátegui'}
                            </span>
                          </td>
                          <td style={{ padding: '12px', textAlign: 'center' }}>
                            <div style={{ display: 'flex', gap: '5px', justifyContent: 'center' }}>
                              <button
                                onClick={() => abrirFormulario(usuario)}
                                style={{
                                  backgroundColor: '#007bff',
                                  color: 'white',
                                  border: 'none',
                                  padding: '5px 10px',
                                  borderRadius: '3px',
                                  cursor: 'pointer',
                                  fontSize: '12px'
                                }}
                                title="Editar"
                              >
                                ✏️
                              </button>
                              <button
                                onClick={() => eliminarUsuario(usuario._id)}
                                style={{
                                  backgroundColor: '#dc3545',
                                  color: 'white',
                                  border: 'none',
                                  padding: '5px 10px',
                                  borderRadius: '3px',
                                  cursor: 'pointer',
                                  fontSize: '12px'
                                }}
                                title="Eliminar"
                              >
                                🗑️
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p>No hay usuarios para mostrar</p>
              )}
            </div>

            {/* Modal del formulario */}
            {mostrarFormulario && (
              <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0,0,0,0.5)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 1000
              }}>
                <div style={{
                  backgroundColor: 'white',
                  padding: '30px',
                  borderRadius: '8px',
                  width: '500px',
                  maxWidth: '90vw'
                }}>
                  <h3 style={{ marginTop: 0 }}>
                    {editandoUsuario ? 'Editar Usuario' : 'Nuevo Usuario'}
                  </h3>
                  
                  <form onSubmit={guardarUsuario}>
                    <div style={{ marginBottom: '15px' }}>
                      <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                        Nombre *
                      </label>
                      <input
                        type="text"
                        value={formularioData.nombre}
                        onChange={(e) => setFormularioData({...formularioData, nombre: e.target.value})}
                        required
                        style={{
                          width: '100%',
                          padding: '8px',
                          border: '1px solid #ddd',
                          borderRadius: '4px',
                          fontSize: '14px'
                        }}
                      />
                    </div>

                    <div style={{ marginBottom: '15px' }}>
                      <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                        Apellido *
                      </label>
                      <input
                        type="text"
                        value={formularioData.apellido}
                        onChange={(e) => setFormularioData({...formularioData, apellido: e.target.value})}
                        required
                        style={{
                          width: '100%',
                          padding: '8px',
                          border: '1px solid #ddd',
                          borderRadius: '4px',
                          fontSize: '14px'
                        }}
                      />
                    </div>

                    <div style={{ marginBottom: '15px' }}>
                      <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                        Email *
                      </label>
                      <input
                        type="email"
                        value={formularioData.correo}
                        onChange={(e) => setFormularioData({...formularioData, correo: e.target.value})}
                        required
                        style={{
                          width: '100%',
                          padding: '8px',
                          border: '1px solid #ddd',
                          borderRadius: '4px',
                          fontSize: '14px'
                        }}
                      />
                    </div>

                    <div style={{ marginBottom: '15px' }}>
                      <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                        Contraseña {editandoUsuario ? '(dejar vacío para mantener actual)' : '*'}
                      </label>
                      <input
                        type="password"
                        value={formularioData.contraseña}
                        onChange={(e) => setFormularioData({...formularioData, contraseña: e.target.value})}
                        required={!editandoUsuario}
                        style={{
                          width: '100%',
                          padding: '8px',
                          border: '1px solid #ddd',
                          borderRadius: '4px',
                          fontSize: '14px'
                        }}
                      />
                    </div>

                    <div style={{ marginBottom: '15px' }}>
                      <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                        Rol *
                      </label>
                      <select
                        value={formularioData.rol}
                        onChange={(e) => setFormularioData({...formularioData, rol: e.target.value})}
                        required
                        style={{
                          width: '100%',
                          padding: '8px',
                          border: '1px solid #ddd',
                          borderRadius: '4px',
                          fontSize: '14px'
                        }}
                      >
                        <option value="Usuario">Usuario</option>
                        <option value="Admin">Admin</option>
                      </select>
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                      <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                        Estado/Capítulo *
                      </label>
                      <select
                        value={formularioData.estado}
                        onChange={(e) => setFormularioData({...formularioData, estado: e.target.value})}
                        required
                        style={{
                          width: '100%',
                          padding: '8px',
                          border: '1px solid #ddd',
                          borderRadius: '4px',
                          fontSize: '14px'
                        }}
                      >
                        <option value="Anzoátegui">Anzoátegui</option>
                        <option value="Zulia">Zulia</option>
                        <option value="Monagas">Monagas</option>
                        <option value="Carabobo">Carabobo</option>
                        <option value="Falcón">Falcón</option>
                      </select>
                    </div>

                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                      <button
                        type="button"
                        onClick={cerrarFormulario}
                        style={{
                          backgroundColor: '#6c757d',
                          color: 'white',
                          border: 'none',
                          padding: '10px 20px',
                          borderRadius: '4px',
                          cursor: 'pointer'
                        }}
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        disabled={loadingUsuarios}
                        style={{
                          backgroundColor: '#28a745',
                          color: 'white',
                          border: 'none',
                          padding: '10px 20px',
                          borderRadius: '4px',
                          cursor: loadingUsuarios ? 'not-allowed' : 'pointer',
                          opacity: loadingUsuarios ? 0.6 : 1
                        }}
                      >
                        {loadingUsuarios ? 'Guardando...' : 'Guardar'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        );
      
      case 'noticias':
        return (
          <div>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px'}}>
              <div>
                <h1 style={{fontSize: '28px', fontWeight: '600', color: '#333', margin: '0 0 10px 0'}}>
                  Gestión de Noticias
                </h1>
                <p style={{color: '#666', margin: '0'}}>
                  Crea y administra las noticias del sector petrolero
                </p>
              </div>
              <button 
                onClick={() => abrirFormularioNoticia()}
                style={{
                  backgroundColor: '#d2691e',
                  color: 'white',
                  border: 'none',
                  padding: '12px 25px',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontSize: '16px'
                }}
              >
                ➕ Nueva Noticia
              </button>
            </div>

            {loadingNoticias ? (
              <div style={{textAlign: 'center', padding: '50px'}}>
                <p>Cargando noticias...</p>
              </div>
            ) : (
              <div style={{backgroundColor: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 4px rgba(0,0,0,0.1)'}}>
                <table style={{width: '100%', borderCollapse: 'collapse'}}>
                  <thead>
                    <tr style={{backgroundColor: '#f8f9fa'}}>
                      <th style={{padding: '15px', textAlign: 'left', borderBottom: '1px solid #dee2e6', fontWeight: '600'}}>Título</th>
                      <th style={{padding: '15px', textAlign: 'left', borderBottom: '1px solid #dee2e6', fontWeight: '600'}}>Autor</th>
                      <th style={{padding: '15px', textAlign: 'center', borderBottom: '1px solid #dee2e6', fontWeight: '600'}}>Fecha</th>
                      <th style={{padding: '15px', textAlign: 'center', borderBottom: '1px solid #dee2e6', fontWeight: '600'}}>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {noticias.length === 0 ? (
                      <tr>
                        <td colSpan="4" style={{padding: '30px', textAlign: 'center', color: '#666'}}>
                          No hay noticias registradas
                        </td>
                      </tr>
                    ) : (
                      noticias.map(noticia => (
                        <tr key={noticia._id} style={{borderBottom: '1px solid #dee2e6'}}>
                          <td style={{padding: '15px', fontWeight: '500'}}>
                            <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                              <div>
                                {noticia.titulo}
                                {noticia.imagen && (
                                  <div style={{fontSize: '12px', color: '#666', marginTop: '5px'}}>
                                    📷 Con imagen
                                  </div>
                                )}
                              </div>
                              {noticia.imagen && (
                                <img 
                                  src={noticia.imagen} 
                                  alt="Vista previa" 
                                  style={{
                                    width: '40px', 
                                    height: '40px', 
                                    objectFit: 'cover', 
                                    borderRadius: '4px',
                                    border: '1px solid #ddd'
                                  }} 
                                />
                              )}
                            </div>
                          </td>
                          <td style={{padding: '15px', color: '#666'}}>{noticia.autor || 'Sin autor'}</td>
                          <td style={{padding: '15px', textAlign: 'center', color: '#666', fontSize: '14px'}}>
                            <div>
                              {noticia.fechaCreacion ? new Date(noticia.fechaCreacion).toLocaleDateString('es-ES') : 
                               noticia.fecha ? new Date(noticia.fecha).toLocaleDateString('es-ES') : 'Sin fecha'}
                            </div>
                            <div style={{fontSize: '12px', color: '#999', marginTop: '2px'}}>
                              {noticia.fechaCreacion ? new Date(noticia.fechaCreacion).toLocaleTimeString('es-ES', {hour: '2-digit', minute: '2-digit'}) : 
                               noticia.fecha ? new Date(noticia.fecha).toLocaleTimeString('es-ES', {hour: '2-digit', minute: '2-digit'}) : ''}
                            </div>
                          </td>
                          <td style={{padding: '15px', textAlign: 'center'}}>
                            <button
                              onClick={() => abrirFormularioNoticia(noticia)}
                              style={{
                                backgroundColor: '#007bff',
                                color: 'white',
                                border: 'none',
                                padding: '8px 12px',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                marginRight: '8px',
                                fontSize: '14px'
                              }}
                            >
                              ✏️
                            </button>
                            <button
                              onClick={() => eliminarNoticia(noticia._id)}
                              style={{
                                backgroundColor: '#dc3545',
                                color: 'white',
                                border: 'none',
                                padding: '8px 12px',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontSize: '14px'
                              }}
                            >
                              🗑️
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* Modal del formulario de noticias */}
            {mostrarFormularioNoticia && (
              <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0,0,0,0.5)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 1000
              }}>
                <div style={{
                  backgroundColor: 'white',
                  padding: '30px',
                  borderRadius: '8px',
                  width: '600px',
                  maxWidth: '90vw',
                  maxHeight: '90vh',
                  overflowY: 'auto'
                }}>
                  <h3 style={{ marginTop: 0 }}>
                    {editandoNoticia ? 'Editar Noticia' : 'Nueva Noticia'}
                  </h3>
                  
                  <form onSubmit={guardarNoticia}>
                    <div style={{ marginBottom: '15px' }}>
                      <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                        Título *
                      </label>
                      <input
                        type="text"
                        value={formularioNoticia.titulo}
                        onChange={(e) => setFormularioNoticia({...formularioNoticia, titulo: e.target.value})}
                        required
                        style={{
                          width: '100%',
                          padding: '8px',
                          border: '1px solid #ddd',
                          borderRadius: '4px',
                          fontSize: '14px'
                        }}
                      />
                    </div>

                    <div style={{ marginBottom: '15px' }}>
                      <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                        Descripción *
                      </label>
                      <textarea
                        value={formularioNoticia.descripcion}
                        onChange={(e) => setFormularioNoticia({...formularioNoticia, descripcion: e.target.value})}
                        required
                        rows="5"
                        style={{
                          width: '100%',
                          padding: '8px',
                          border: '1px solid #ddd',
                          borderRadius: '4px',
                          fontSize: '14px',
                          resize: 'vertical'
                        }}
                      />
                    </div>

                    <div style={{ marginBottom: '15px' }}>
                      <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                        Imagen (opcional)
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setFormularioNoticia({...formularioNoticia, imagen: e.target.files[0]})}
                        style={{
                          width: '100%',
                          padding: '8px',
                          border: '1px solid #ddd',
                          borderRadius: '4px',
                          fontSize: '14px'
                        }}
                      />
                      {formularioNoticia.imagen && (
                        <div style={{ marginTop: '8px', fontSize: '12px', color: '#666' }}>
                          📷 Archivo seleccionado: {formularioNoticia.imagen.name}
                        </div>
                      )}
                    </div>

                    <div style={{ marginBottom: '15px' }}>
                      <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                        Autor
                      </label>
                      <input
                        type="text"
                        value={`${user?.nombre || user?.Nombre || 'Usuario'} ${user?.apellido || user?.Apellido || ''}`.trim()}
                        disabled
                        style={{
                          width: '100%',
                          padding: '8px',
                          border: '1px solid #ddd',
                          borderRadius: '4px',
                          fontSize: '14px',
                          backgroundColor: '#f8f9fa',
                          color: '#666'
                        }}
                      />
                      <div style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
                        El autor se asigna automáticamente con tu usuario
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' }}>
                      <button
                        type="button"
                        onClick={cerrarFormularioNoticia}
                        style={{
                          backgroundColor: '#6c757d',
                          color: 'white',
                          border: 'none',
                          padding: '10px 20px',
                          borderRadius: '4px',
                          cursor: 'pointer'
                        }}
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        disabled={loadingNoticias}
                        style={{
                          backgroundColor: '#28a745',
                          color: 'white',
                          border: 'none',
                          padding: '10px 20px',
                          borderRadius: '4px',
                          cursor: loadingNoticias ? 'not-allowed' : 'pointer',
                          opacity: loadingNoticias ? 0.6 : 1
                        }}
                      >
                        {loadingNoticias ? 'Guardando...' : 'Guardar'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        );
      
      case 'eventos':
        return (
          <div>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px'}}>
              <div>
                <h1 style={{fontSize: '28px', fontWeight: '600', color: '#333', margin: '0 0 10px 0'}}>
                  Gestión de Eventos
                </h1>
                <p style={{color: '#666', margin: '0'}}>
                  Organiza eventos y actividades de la cámara petrolera
                </p>
              </div>
              <button 
                onClick={() => abrirFormularioEvento()}
                style={{
                  backgroundColor: '#d2691e',
                  color: 'white',
                  border: 'none',
                  padding: '12px 25px',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontSize: '16px'
                }}
              >
                ➕ Nuevo Evento
              </button>
            </div>

            {loadingEventos ? (
              <div style={{textAlign: 'center', padding: '50px'}}>
                <p>Cargando eventos...</p>
              </div>
            ) : (
              <div style={{backgroundColor: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 4px rgba(0,0,0,0.1)'}}>
                <table style={{width: '100%', borderCollapse: 'collapse'}}>
                  <thead>
                    <tr style={{backgroundColor: '#f8f9fa'}}>
                      <th style={{padding: '15px', textAlign: 'left', borderBottom: '1px solid #dee2e6', fontWeight: '600'}}>Evento</th>
                      <th style={{padding: '15px', textAlign: 'left', borderBottom: '1px solid #dee2e6', fontWeight: '600'}}>Organizador</th>
                      <th style={{padding: '15px', textAlign: 'center', borderBottom: '1px solid #dee2e6', fontWeight: '600'}}>Fecha Evento</th>
                      <th style={{padding: '15px', textAlign: 'left', borderBottom: '1px solid #dee2e6', fontWeight: '600'}}>Estado</th>
                      <th style={{padding: '15px', textAlign: 'center', borderBottom: '1px solid #dee2e6', fontWeight: '600'}}>Estado Evento</th>
                      <th style={{padding: '15px', textAlign: 'center', borderBottom: '1px solid #dee2e6', fontWeight: '600'}}>Fecha Creación</th>
                      <th style={{padding: '15px', textAlign: 'center', borderBottom: '1px solid #dee2e6', fontWeight: '600'}}>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {eventos.length === 0 ? (
                      <tr>
                        <td colSpan="7" style={{padding: '30px', textAlign: 'center', color: '#666'}}>
                          No hay eventos registrados
                        </td>
                      </tr>
                    ) : (
                      eventos.map(evento => (
                        <tr key={evento._id} style={{
                          borderBottom: '1px solid #dee2e6',
                          backgroundColor: evento.cancelado ? '#fff5f5' : 'transparent',
                          opacity: evento.cancelado ? 0.7 : 1
                        }}>
                          <td style={{padding: '15px', fontWeight: '500'}}>
                            <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                              <div>
                                <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                                {evento.titulo}
                                  {evento.cancelado && (
                                    <span style={{
                                      backgroundColor: '#dc3545',
                                      color: 'white',
                                      padding: '2px 6px',
                                      borderRadius: '10px',
                                      fontSize: '10px',
                                      fontWeight: '600'
                                    }}>
                                      CANCELADO
                                    </span>
                                  )}
                                </div>
                                {evento.imagen && (
                                  <div style={{fontSize: '12px', color: '#666', marginTop: '5px'}}>
                                    📷 Con imagen
                                  </div>
                                )}
                              </div>
                              {evento.imagen && (
                                <img 
                                  src={evento.imagen} 
                                  alt="Vista previa" 
                                  style={{
                                    width: '40px', 
                                    height: '40px', 
                                    objectFit: 'cover', 
                                    borderRadius: '4px',
                                    border: '1px solid #ddd'
                                  }} 
                                />
                              )}
                            </div>
                          </td>
                          <td style={{padding: '15px', color: '#666'}}>{evento.organizador || 'Sin organizador'}</td>
                          <td style={{padding: '15px', textAlign: 'center', color: '#666', fontSize: '14px'}}>
                            <div style={{fontWeight: '500', color: evento.cancelado ? '#666' : '#d2691e'}}>
                              {evento.fechaEvento ? new Date(evento.fechaEvento).toLocaleDateString('es-ES') : 'Sin fecha'}
                            </div>
                            {evento.horaEvento && (
                              <div style={{fontSize: '12px', color: '#666', marginTop: '2px'}}>
                                🕒 {evento.horaEvento}
                              </div>
                            )}
                          </td>
                          <td style={{padding: '15px'}}>
                            <span style={{
                              backgroundColor: '#17a2b8',
                              color: 'white',
                              padding: '4px 8px',
                              borderRadius: '4px',
                              fontSize: '12px'
                            }}>
                              {evento.estado || 'Anzoátegui'}
                            </span>
                          </td>
                          <td style={{padding: '15px', textAlign: 'center'}}>
                            <span style={{
                              backgroundColor: evento.cancelado ? '#dc3545' : '#28a745',
                              color: 'white',
                              padding: '4px 8px',
                              borderRadius: '4px',
                              fontSize: '12px',
                              fontWeight: '600'
                            }}>
                              {evento.cancelado ? '❌ CANCELADO' : '✅ ACTIVO'}
                            </span>
                          </td>
                          <td style={{padding: '15px', textAlign: 'center', color: '#666', fontSize: '14px'}}>
                            <div>
                              {evento.fechaCreacion ? new Date(evento.fechaCreacion).toLocaleDateString('es-ES') : 
                               evento.fecha ? new Date(evento.fecha).toLocaleDateString('es-ES') : 'Sin fecha'}
                            </div>
                            <div style={{fontSize: '12px', color: '#999', marginTop: '2px'}}>
                              {evento.fechaCreacion ? new Date(evento.fechaCreacion).toLocaleTimeString('es-ES', {hour: '2-digit', minute: '2-digit'}) : 
                               evento.fecha ? new Date(evento.fecha).toLocaleTimeString('es-ES', {hour: '2-digit', minute: '2-digit'}) : ''}
                            </div>
                          </td>
                          <td style={{padding: '15px', textAlign: 'center'}}>
                            <div style={{display: 'flex', gap: '4px', justifyContent: 'center', flexWrap: 'wrap'}}>
                            <button
                              onClick={() => abrirFormularioEvento(evento)}
                              style={{
                                backgroundColor: '#007bff',
                                color: 'white',
                                border: 'none',
                                  padding: '6px 10px',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                  fontSize: '12px',
                                  minWidth: '32px'
                              }}
                                title="Editar evento"
                            >
                              ✏️
                            </button>
                              <button
                                onClick={() => toggleCancelarEvento(evento._id, evento.cancelado)}
                                style={{
                                  backgroundColor: evento.cancelado ? '#28a745' : '#ffc107',
                                  color: evento.cancelado ? 'white' : '#212529',
                                  border: 'none',
                                  padding: '6px 10px',
                                  borderRadius: '4px',
                                  cursor: 'pointer',
                                  fontSize: '12px',
                                  minWidth: '32px'
                                }}
                                title={evento.cancelado ? 'Reactivar evento' : 'Cancelar evento'}
                              >
                                {evento.cancelado ? '🔄' : '❌'}
                              </button>
                            <button
                              onClick={() => eliminarEvento(evento._id)}
                              style={{
                                backgroundColor: '#dc3545',
                                color: 'white',
                                border: 'none',
                                  padding: '6px 10px',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                  fontSize: '12px',
                                  minWidth: '32px'
                              }}
                                title="Eliminar evento"
                            >
                              🗑️
                            </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* Modal del formulario de eventos */}
            {mostrarFormularioEvento && (
              <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0,0,0,0.5)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 1000
              }}>
                <div style={{
                  backgroundColor: 'white',
                  padding: '30px',
                  borderRadius: '8px',
                  width: '600px',
                  maxWidth: '90vw',
                  maxHeight: '90vh',
                  overflowY: 'auto'
                }}>
                  <h3 style={{ marginTop: 0 }}>
                    {editandoEvento ? 'Editar Evento' : 'Nuevo Evento'}
                  </h3>
                  
                  <form onSubmit={guardarEvento}>
                    <div style={{ marginBottom: '15px' }}>
                      <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                        Título *
                      </label>
                      <input
                        type="text"
                        value={formularioEvento.titulo}
                        onChange={(e) => setFormularioEvento({...formularioEvento, titulo: e.target.value})}
                        required
                        style={{
                          width: '100%',
                          padding: '8px',
                          border: '1px solid #ddd',
                          borderRadius: '4px',
                          fontSize: '14px'
                        }}
                      />
                    </div>

                    <div style={{ marginBottom: '15px' }}>
                      <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                        Descripción *
                      </label>
                      <textarea
                        value={formularioEvento.descripcion}
                        onChange={(e) => setFormularioEvento({...formularioEvento, descripcion: e.target.value})}
                        required
                        rows="5"
                        style={{
                          width: '100%',
                          padding: '8px',
                          border: '1px solid #ddd',
                          borderRadius: '4px',
                          fontSize: '14px',
                          resize: 'vertical'
                        }}
                      />
                    </div>

                    <div style={{ marginBottom: '15px' }}>
                      <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                        Fecha del Evento *
                      </label>
                      <input
                        type="date"
                        value={formularioEvento.fechaEvento}
                        onChange={(e) => setFormularioEvento({...formularioEvento, fechaEvento: e.target.value})}
                        required
                        style={{
                          width: '100%',
                          padding: '8px',
                          border: '1px solid #ddd',
                          borderRadius: '4px',
                          fontSize: '14px'
                        }}
                      />
                    </div>

                    <div style={{ marginBottom: '15px' }}>
                      <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                        Hora de Inicio *
                      </label>
                      <input
                        type="time"
                        value={formularioEvento.horaEvento}
                        onChange={(e) => setFormularioEvento({...formularioEvento, horaEvento: e.target.value})}
                        required
                        style={{
                          width: '100%',
                          padding: '8px',
                          border: '1px solid #ddd',
                          borderRadius: '4px',
                          fontSize: '14px'
                        }}
                      />
                    </div>

                    <div style={{ marginBottom: '15px' }}>
                      <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                        Imagen (opcional)
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setFormularioEvento({...formularioEvento, imagen: e.target.files[0]})}
                        style={{
                          width: '100%',
                          padding: '8px',
                          border: '1px solid #ddd',
                          borderRadius: '4px',
                          fontSize: '14px'
                        }}
                      />
                      {formularioEvento.imagen && (
                        <div style={{ marginTop: '8px', fontSize: '12px', color: '#666' }}>
                          📷 Archivo seleccionado: {formularioEvento.imagen.name}
                        </div>
                      )}
                    </div>

                    <div style={{ marginBottom: '15px' }}>
                      <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                        Organizador
                      </label>
                      <input
                        type="text"
                        value={`${user?.nombre || user?.Nombre || 'Usuario'} ${user?.apellido || user?.Apellido || ''}`.trim()}
                        disabled
                        style={{
                          width: '100%',
                          padding: '8px',
                          border: '1px solid #ddd',
                          borderRadius: '4px',
                          fontSize: '14px',
                          backgroundColor: '#f8f9fa',
                          color: '#666'
                        }}
                      />
                      <div style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
                        El organizador se asigna automáticamente con tu usuario
                      </div>
                    </div>

                    <div style={{ marginBottom: '15px' }}>
                      <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                        Estado/Capítulo
                      </label>
                      <input
                        type="text"
                        value={user?.estado || 'Anzoátegui'}
                        disabled
                        style={{
                          width: '100%',
                          padding: '8px',
                          border: '1px solid #ddd',
                          borderRadius: '4px',
                          fontSize: '14px',
                          backgroundColor: '#f8f9fa',
                          color: '#666'
                        }}
                      />
                      <div style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
                        El estado se asigna automáticamente según tu perfil
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' }}>
                      <button
                        type="button"
                        onClick={cerrarFormularioEvento}
                        style={{
                          backgroundColor: '#6c757d',
                          color: 'white',
                          border: 'none',
                          padding: '10px 20px',
                          borderRadius: '4px',
                          cursor: 'pointer'
                        }}
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        disabled={loadingEventos}
                        style={{
                          backgroundColor: '#28a745',
                          color: 'white',
                          border: 'none',
                          padding: '10px 20px',
                          borderRadius: '4px',
                          cursor: loadingEventos ? 'not-allowed' : 'pointer',
                          opacity: loadingEventos ? 0.6 : 1
                        }}
                      >
                        {loadingEventos ? 'Guardando...' : 'Guardar'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        );
      
      case 'empresas':
        return (
          <div>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px'}}>
              <div>
                <h1 style={{fontSize: '28px', fontWeight: '600', color: '#333', margin: '0 0 10px 0'}}>
                  Gestión de Empresas
                </h1>
                <p style={{color: '#666', margin: '0'}}>
                  Administra el directorio de empresas afiliadas
                </p>
              </div>
              <button 
                onClick={() => abrirFormularioEmpresa()}
                style={{
                  backgroundColor: '#d2691e',
                  color: 'white',
                  border: 'none',
                  padding: '12px 25px',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontSize: '16px'
                }}
              >
                ➕ Nueva Empresa
              </button>
            </div>

            {loadingEmpresas ? (
              <div style={{textAlign: 'center', padding: '50px'}}>
                <p>Cargando empresas...</p>
              </div>
            ) : (
              <div style={{backgroundColor: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 4px rgba(0,0,0,0.1)'}}>
                <table style={{width: '100%', borderCollapse: 'collapse'}}>
                  <thead>
                    <tr style={{backgroundColor: '#f8f9fa'}}>
                      <th style={{padding: '15px', textAlign: 'left', borderBottom: '1px solid #dee2e6', fontWeight: '600'}}>Empresa</th>
                      <th style={{padding: '15px', textAlign: 'left', borderBottom: '1px solid #dee2e6', fontWeight: '600'}}>Región</th>
                      <th style={{padding: '15px', textAlign: 'left', borderBottom: '1px solid #dee2e6', fontWeight: '600'}}>Sector</th>
                      <th style={{padding: '15px', textAlign: 'left', borderBottom: '1px solid #dee2e6', fontWeight: '600'}}>Contacto</th>
                      <th style={{padding: '15px', textAlign: 'center', borderBottom: '1px solid #dee2e6', fontWeight: '600'}}>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {empresas.length === 0 ? (
                      <tr>
                        <td colSpan="5" style={{padding: '30px', textAlign: 'center', color: '#666'}}>
                          No hay empresas registradas
                        </td>
                      </tr>
                    ) : (
                      empresas.map(empresa => (
                        <tr key={empresa._id} style={{borderBottom: '1px solid #dee2e6'}}>
                          <td style={{padding: '15px', fontWeight: '500'}}>
                            <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                              <div>
                                {empresa.nombre}
                                {empresa.logo && (
                                  <div style={{fontSize: '12px', color: '#666', marginTop: '5px'}}>
                                    🏢 Con logo
                                  </div>
                                )}
                                {empresa.imagenes && empresa.imagenes.length > 0 && (
                                  <div style={{fontSize: '12px', color: '#28a745', marginTop: '5px'}}>
                                    📸 {empresa.imagenes.length} imagen(es)
                                  </div>
                                )}
                              </div>
                              {empresa.logo && (
                                <img 
                                  src={empresa.logo} 
                                  alt="Logo empresa" 
                                  style={{
                                    width: '40px', 
                                    height: '40px', 
                                    objectFit: 'cover', 
                                    borderRadius: '4px',
                                    border: '1px solid #ddd'
                                  }} 
                                />
                              )}
                            </div>
                          </td>
                          <td style={{padding: '15px'}}>
                            <span style={{
                              backgroundColor: '#17a2b8',
                              color: 'white',
                              padding: '4px 8px',
                              borderRadius: '4px',
                              fontSize: '12px'
                            }}>
                              {empresa.region || 'Sin región'}
                            </span>
                          </td>
                          <td style={{padding: '15px', color: '#666'}}>{empresa.sector || 'Sin sector'}</td>
                          <td style={{padding: '15px', color: '#666', fontSize: '14px'}}>
                            {empresa.telefono && (
                              <div>📞 {empresa.telefono}</div>
                            )}
                            {empresa.correo && (
                              <div style={{marginTop: '5px'}}>✉️ {empresa.correo}</div>
                            )}
                          </td>
                          <td style={{padding: '15px', textAlign: 'center'}}>
                            <button
                              onClick={() => abrirFormularioEmpresa(empresa)}
                              style={{
                                backgroundColor: '#007bff',
                                color: 'white',
                                border: 'none',
                                padding: '8px 12px',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                marginRight: '8px',
                                fontSize: '14px'
                              }}
                            >
                              ✏️
                            </button>
                            <button
                              onClick={() => agregarImagenesPrueba(empresa._id)}
                              style={{
                                backgroundColor: '#28a745',
                                color: 'white',
                                border: 'none',
                                padding: '8px 12px',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                marginRight: '8px',
                                fontSize: '14px'
                              }}
                              title="Agregar imágenes de prueba"
                            >
                              📸
                            </button>
                            <button
                              onClick={() => eliminarEmpresa(empresa._id)}
                              style={{
                                backgroundColor: '#dc3545',
                                color: 'white',
                                border: 'none',
                                padding: '8px 12px',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontSize: '14px'
                              }}
                            >
                              🗑️
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* Modal del formulario de empresas */}
            {mostrarFormularioEmpresa && (
              <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0,0,0,0.5)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 1000
              }}>
                <div style={{
                  backgroundColor: 'white',
                  padding: '30px',
                  borderRadius: '8px',
                  width: '600px',
                  maxWidth: '90vw',
                  maxHeight: '90vh',
                  overflowY: 'auto'
                }}>
                  <h3 style={{ marginTop: 0 }}>
                    {editandoEmpresa ? 'Editar Empresa' : 'Nueva Empresa'}
                  </h3>
                  
                  <form onSubmit={guardarEmpresa}>
                    <div style={{ marginBottom: '15px' }}>
                      <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                        Nombre de la Empresa *
                      </label>
                      <input
                        type="text"
                        value={formularioEmpresa.nombre}
                        onChange={(e) => setFormularioEmpresa({...formularioEmpresa, nombre: e.target.value})}
                        required
                        style={{
                          width: '100%',
                          padding: '8px',
                          border: '1px solid #ddd',
                          borderRadius: '4px',
                          fontSize: '14px'
                        }}
                      />
                    </div>

                    <div style={{ marginBottom: '15px' }}>
                      <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                        Región/Capítulo *
                      </label>
                      <select
                        value={formularioEmpresa.region}
                        onChange={(e) => setFormularioEmpresa({...formularioEmpresa, region: e.target.value})}
                        required
                        style={{
                          width: '100%',
                          padding: '8px',
                          border: '1px solid #ddd',
                          borderRadius: '4px',
                          fontSize: '14px'
                        }}
                      >
                        <option value="">Seleccione una región...</option>
                        <option value="Anzoátegui">Anzoátegui</option>
                        <option value="Carabobo">Carabobo</option>
                        <option value="Falcón">Falcón</option>
                        <option value="Monagas">Monagas</option>
                        <option value="Zulia">Zulia</option>
                      </select>
                    </div>

                    <div style={{ marginBottom: '15px' }}>
                      <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                        Sector *
                      </label>
                      <select
                        value={formularioEmpresa.sector}
                        onChange={(e) => setFormularioEmpresa({...formularioEmpresa, sector: e.target.value})}
                        required
                        style={{
                          width: '100%',
                          padding: '8px',
                          border: '1px solid #ddd',
                          borderRadius: '4px',
                          fontSize: '14px'
                        }}
                      >
                        <option value="">Seleccione un sector...</option>
                        <option value="Petróleo y Gas">Petróleo y Gas</option>
                        <option value="Tecnología">Tecnología</option>
                        <option value="Finanzas">Finanzas</option>
                        <option value="Construcción">Construcción</option>
                        <option value="Minería">Minería</option>
                        <option value="Transporte">Transporte</option>
                        <option value="Servicios">Servicios</option>
                        <option value="Comercio">Comercio</option>
                        <option value="Otro">Otro</option>
                      </select>
                    </div>

                    <div style={{ marginBottom: '15px' }}>
                      <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                        Descripción *
                      </label>
                      <textarea
                        value={formularioEmpresa.descripcion}
                        onChange={(e) => setFormularioEmpresa({...formularioEmpresa, descripcion: e.target.value})}
                        required
                        rows="4"
                        style={{
                          width: '100%',
                          padding: '8px',
                          border: '1px solid #ddd',
                          borderRadius: '4px',
                          fontSize: '14px',
                          resize: 'vertical'
                        }}
                      />
                    </div>

                    <div style={{ marginBottom: '15px' }}>
                      <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                        Teléfono
                      </label>
                      <input
                        type="tel"
                        value={formularioEmpresa.telefono}
                        onChange={(e) => setFormularioEmpresa({...formularioEmpresa, telefono: e.target.value})}
                        style={{
                          width: '100%',
                          padding: '8px',
                          border: '1px solid #ddd',
                          borderRadius: '4px',
                          fontSize: '14px'
                        }}
                      />
                    </div>

                    <div style={{ marginBottom: '15px' }}>
                      <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                        Correo Electrónico
                      </label>
                      <input
                        type="email"
                        value={formularioEmpresa.correo}
                        onChange={(e) => setFormularioEmpresa({...formularioEmpresa, correo: e.target.value})}
                        style={{
                          width: '100%',
                          padding: '8px',
                          border: '1px solid #ddd',
                          borderRadius: '4px',
                          fontSize: '14px'
                        }}
                      />
                    </div>

                    <div style={{ marginBottom: '15px' }}>
                      <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                        Logo de la Empresa
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setFormularioEmpresa({...formularioEmpresa, logo: e.target.files[0]})}
                        style={{
                          width: '100%',
                          padding: '8px',
                          border: '1px solid #ddd',
                          borderRadius: '4px',
                          fontSize: '14px'
                        }}
                      />
                      {formularioEmpresa.logo && (
                        <div style={{ marginTop: '8px', fontSize: '12px', color: '#666' }}>
                          🏢 Archivo seleccionado: {formularioEmpresa.logo.name}
                        </div>
                      )}
                      <div style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
                        Formatos permitidos: JPG, JPEG, PNG, GIF. Tamaño máximo: 5MB
                      </div>
                    </div>

                    <div style={{ marginBottom: '15px' }}>
                      <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                        Galería de Imágenes (Opcional)
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={(e) => {
                          const files = Array.from(e.target.files);
                          setFormularioEmpresa({...formularioEmpresa, imagenes: files});
                        }}
                        style={{
                          width: '100%',
                          padding: '8px',
                          border: '1px solid #ddd',
                          borderRadius: '4px',
                          fontSize: '14px'
                        }}
                      />
                      {formularioEmpresa.imagenes.length > 0 && (
                        <div style={{ marginTop: '8px', fontSize: '12px', color: '#666' }}>
                          📸 {formularioEmpresa.imagenes.length} imagen(es) seleccionada(s):
                          <ul style={{ margin: '5px 0', paddingLeft: '20px' }}>
                            {Array.from(formularioEmpresa.imagenes).map((file, index) => (
                              <li key={index}>{file.name}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      <div style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
                        Puedes seleccionar múltiples imágenes para la galería. Formatos: JPG, JPEG, PNG, GIF. Máximo 5MB cada una.
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' }}>
                      <button
                        type="button"
                        onClick={cerrarFormularioEmpresa}
                        style={{
                          backgroundColor: '#6c757d',
                          color: 'white',
                          border: 'none',
                          padding: '10px 20px',
                          borderRadius: '4px',
                          cursor: 'pointer'
                        }}
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        disabled={loadingEmpresas}
                        style={{
                          backgroundColor: '#28a745',
                          color: 'white',
                          border: 'none',
                          padding: '10px 20px',
                          borderRadius: '4px',
                          cursor: loadingEmpresas ? 'not-allowed' : 'pointer',
                          opacity: loadingEmpresas ? 0.6 : 1
                        }}
                      >
                        {loadingEmpresas ? 'Guardando...' : 'Guardar'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        );

      case 'slides':
        return (
          <div>
            <iframe 
              src="/dashboard/slides" 
              style={{
                width: '100%',
                height: 'calc(100vh - 140px)',
                border: 'none',
                borderRadius: '8px',
                backgroundColor: 'white'
              }}
              title="Gestión de Slides"
            />
          </div>
        );

      default:
        return <div>Sección no encontrada</div>;
    }
  };

  return (
    <div style={{
      display: 'flex',
      height: '100vh',
      backgroundColor: '#f5f5f5',
      fontFamily: 'Arial, sans-serif'
    }}>
      {/* Header */}
      <header style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '70px',
        background: 'white',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 20px',
        zIndex: 1000
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#d2691e' }}>
            CPV Admin
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
            <p style={{ fontWeight: '600', color: '#333', margin: '0' }}>
              {user.nombre}
            </p>
            <p style={{ fontSize: '14px', color: '#666', margin: '0' }}>
              {user.email || user.correo}
            </p>
          </div>
          <button 
            onClick={handleLogout}
            style={{
              background: '#dc3545',
              color: 'white',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Cerrar Sesión
          </button>
        </div>
      </header>

      {/* Sidebar */}
      <nav style={{
        width: '250px',
        background: 'white',
        boxShadow: '2px 0 4px rgba(0,0,0,0.1)',
        marginTop: '70px',
        height: 'calc(100vh - 70px)',
        padding: '20px 0'
      }}>
        <ul style={{ listStyle: 'none', padding: '0', margin: '0' }}>
          <li 
            onClick={() => setActiveSection('usuarios')}
            style={{
              padding: '15px 25px',
              cursor: 'pointer',
              borderBottom: '1px solid #eee',
              backgroundColor: activeSection === 'usuarios' ? '#d2691e' : 'transparent',
              color: activeSection === 'usuarios' ? 'white' : '#333',
              borderLeft: activeSection === 'usuarios' ? '4px solid #a0522d' : 'none'
            }}
          >
            <i className="fas fa-users" style={{ marginRight: '10px', width: '20px' }}></i>
            Usuarios
          </li>
          <li 
            onClick={() => setActiveSection('noticias')}
            style={{
              padding: '15px 25px',
              cursor: 'pointer',
              borderBottom: '1px solid #eee',
              backgroundColor: activeSection === 'noticias' ? '#d2691e' : 'transparent',
              color: activeSection === 'noticias' ? 'white' : '#333',
              borderLeft: activeSection === 'noticias' ? '4px solid #a0522d' : 'none'
            }}
          >
            <i className="fas fa-newspaper" style={{ marginRight: '10px', width: '20px' }}></i>
            Noticias
          </li>
          <li 
            onClick={() => setActiveSection('eventos')}
            style={{
              padding: '15px 25px',
              cursor: 'pointer',
              borderBottom: '1px solid #eee',
              backgroundColor: activeSection === 'eventos' ? '#d2691e' : 'transparent',
              color: activeSection === 'eventos' ? 'white' : '#333',
              borderLeft: activeSection === 'eventos' ? '4px solid #a0522d' : 'none'
            }}
          >
            <i className="fas fa-calendar-alt" style={{ marginRight: '10px', width: '20px' }}></i>
            Eventos
          </li>
          <li 
            onClick={() => setActiveSection('empresas')}
            style={{
              padding: '15px 25px',
              cursor: 'pointer',
              borderBottom: '1px solid #eee',
              backgroundColor: activeSection === 'empresas' ? '#d2691e' : 'transparent',
              color: activeSection === 'empresas' ? 'white' : '#333',
              borderLeft: activeSection === 'empresas' ? '4px solid #a0522d' : 'none'
            }}
          >
            <i className="fas fa-building" style={{ marginRight: '10px', width: '20px' }}></i>
            Empresas
          </li>
          <li 
            onClick={() => setActiveSection('slides')}
            style={{
              padding: '15px 25px',
              cursor: 'pointer',
              borderBottom: '1px solid #eee',
              backgroundColor: activeSection === 'slides' ? '#d2691e' : 'transparent',
              color: activeSection === 'slides' ? 'white' : '#333',
              borderLeft: activeSection === 'slides' ? '4px solid #a0522d' : 'none'
            }}
          >
            <i className="fas fa-images" style={{ marginRight: '10px', width: '20px' }}></i>
            Slides
          </li>
        </ul>
      </nav>

      {/* Contenido Principal */}
      <main style={{
        flex: 1,
        marginTop: '70px',
        marginLeft: '250px',
        padding: '30px',
        overflowY: 'auto'
      }}>
        {renderContent()}
      </main>
    </div>
  );
}
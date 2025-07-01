'use client'

import { useState, useEffect } from 'react';

export default function SlidesPage() {
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingSlide, setEditingSlide] = useState(null);
  const [formData, setFormData] = useState({
    titulo: '',
    subtitulo: '',
    imagen: '',
    orden: 1
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  // Cargar slides
  const cargarSlides = async () => {
    try {
      const response = await fetch('/api/slides');
      const data = await response.json();
      if (data.success) {
        setSlides(data.slides);
      }
    } catch (error) {
      console.error('Error al cargar slides:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarSlides();
  }, []);

  // Manejar envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = formData.imagen;

      // Si hay un archivo seleccionado, subirlo primero
      if (selectedFile) {
        setUploading(true);
        const uploadFormData = new FormData();
        uploadFormData.append('imagen', selectedFile);

        const uploadResponse = await fetch('/api/slides/upload', {
          method: 'POST',
          body: uploadFormData,
        });

        const uploadData = await uploadResponse.json();
        
        if (uploadData.success) {
          imageUrl = uploadData.imageUrl;
        } else {
          alert('Error al subir imagen: ' + uploadData.error);
          setLoading(false);
          setUploading(false);
          return;
        }
        setUploading(false);
      }

      const slideData = {
        ...formData,
        imagen: imageUrl
      };

      const url = editingSlide ? `/api/slides/${editingSlide._id}` : '/api/slides';
      const method = editingSlide ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(slideData),
      });

      const data = await response.json();

      if (data.success) {
        alert(editingSlide ? 'Slide actualizado correctamente' : 'Slide creado correctamente');
        setShowForm(false);
        setEditingSlide(null);
        setFormData({ titulo: '', subtitulo: '', imagen: '', orden: 1 });
        setSelectedFile(null);
        cargarSlides();
      } else {
        alert('Error: ' + data.error);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al procesar la solicitud');
    } finally {
      setLoading(false);
      setUploading(false);
    }
  };

  // Eliminar slide
  const eliminarSlide = async (id) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este slide?')) return;

    try {
      const response = await fetch(`/api/slides?id=${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        alert('Slide eliminado correctamente');
        cargarSlides();
      } else {
        alert('Error: ' + data.error);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al eliminar el slide');
    }
  };

  // Editar slide
  const editarSlide = (slide) => {
    setEditingSlide(slide);
    setFormData({
      titulo: slide.titulo,
      subtitulo: slide.subtitulo,
      imagen: slide.imagen,
      orden: slide.orden
    });
    setShowForm(true);
  };

  // Manejar selección de archivo
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validar tipo de archivo
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        alert('Tipo de archivo no permitido. Solo se permiten imágenes (JPG, PNG, GIF, WEBP)');
        return;
      }
      
      // Validar tamaño (5MB máximo)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        alert('El archivo es demasiado grande. Máximo 5MB');
        return;
      }
      
      setSelectedFile(file);
    }
  };

  // Cancelar edición
  const cancelarEdicion = () => {
    setShowForm(false);
    setEditingSlide(null);
    setFormData({ titulo: '', subtitulo: '', imagen: '', orden: 1 });
    setSelectedFile(null);
  };

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '30px' 
      }}>
        <div>
          <h1 style={{ color: '#333', marginBottom: '10px' }}>Gestión de Slides</h1>
          <p style={{ color: '#666', margin: 0 }}>Administra los slides del hero section de la página principal</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          style={{
            backgroundColor: '#d2691e',
            color: 'white',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '600'
          }}
        >
          + Nuevo Slide
        </button>
      </div>

      {/* Formulario */}
      {showForm && (
        <div style={{
          backgroundColor: 'white',
          border: '1px solid #ddd',
          borderRadius: '8px',
          padding: '30px',
          marginBottom: '30px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ marginBottom: '20px', color: '#333' }}>
            {editingSlide ? 'Editar Slide' : 'Nuevo Slide'}
          </h3>
          
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gap: '20px', gridTemplateColumns: '1fr 1fr' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', color: '#333' }}>
                  Título:
                </label>
                <input
                  type="text"
                  value={formData.titulo}
                  onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                  required
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '14px'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', color: '#333' }}>
                  Orden:
                </label>
                <input
                  type="number"
                  value={formData.orden}
                  onChange={(e) => setFormData({ ...formData, orden: parseInt(e.target.value) })}
                  required
                  min="1"
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '14px'
                  }}
                />
              </div>
            </div>

            <div style={{ marginTop: '20px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', color: '#333' }}>
                Subtítulo:
              </label>
              <textarea
                value={formData.subtitulo}
                onChange={(e) => setFormData({ ...formData, subtitulo: e.target.value })}
                required
                rows="3"
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '14px',
                  resize: 'vertical'
                }}
              />
            </div>

            <div style={{ marginTop: '20px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', color: '#333' }}>
                Imagen del Slide:
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '14px'
                }}
              />
              {selectedFile && (
                <div style={{ marginTop: '8px', fontSize: '12px', color: '#28a745' }}>
                  📷 Archivo seleccionado: {selectedFile.name}
                </div>
              )}
              {editingSlide && formData.imagen && !selectedFile && (
                <div style={{ marginTop: '8px', fontSize: '12px', color: '#666' }}>
                  📷 Imagen actual: {formData.imagen}
                </div>
              )}
              <small style={{ color: '#666', fontSize: '12px', marginTop: '5px', display: 'block' }}>
                Formatos permitidos: JPG, PNG, GIF, WEBP. Máximo 5MB.
                {editingSlide && ' Deja vacío para mantener la imagen actual.'}
              </small>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '30px' }}>
              <button
                type="submit"
                disabled={loading || uploading}
                style={{
                  backgroundColor: '#28a745',
                  color: 'white',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '6px',
                  cursor: (loading || uploading) ? 'not-allowed' : 'pointer',
                  fontSize: '14px',
                  fontWeight: '600',
                  opacity: (loading || uploading) ? 0.6 : 1
                }}
              >
                {uploading ? 'Subiendo imagen...' : (loading ? 'Procesando...' : (editingSlide ? 'Actualizar' : 'Crear'))}
              </button>
              
              <button
                type="button"
                onClick={cancelarEdicion}
                style={{
                  backgroundColor: '#6c757d',
                  color: 'white',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600'
                }}
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Lista de slides */}
      <div style={{
        backgroundColor: 'white',
        border: '1px solid #ddd',
        borderRadius: '8px',
        overflow: 'hidden',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <div style={{
          backgroundColor: '#f8f9fa',
          padding: '15px 20px',
          borderBottom: '1px solid #ddd',
          fontWeight: '600',
          color: '#333'
        }}>
          Lista de Slides
        </div>

        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>
            Cargando slides...
          </div>
        ) : slides.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>
            No hay slides creados. ¡Crea el primero!
          </div>
        ) : (
          <div style={{ padding: '20px' }}>
            {slides.map((slide) => (
              <div key={slide._id} style={{
                border: '1px solid #eee',
                borderRadius: '6px',
                padding: '20px',
                marginBottom: '15px',
                backgroundColor: '#f9f9f9'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ margin: '0 0 10px 0', color: '#333', fontSize: '18px' }}>
                      {slide.titulo}
                    </h4>
                    <p style={{ margin: '0 0 10px 0', color: '#666', lineHeight: '1.5' }}>
                      {slide.subtitulo}
                    </p>
                    <div style={{ display: 'flex', gap: '20px', fontSize: '12px', color: '#888' }}>
                      <span>Orden: {slide.orden}</span>
                      <span>Imagen: {slide.imagen || '/img/banner.png'}</span>
                      <span>Estado: {slide.activo ? 'Activo' : 'Inactivo'}</span>
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                      onClick={() => editarSlide(slide)}
                      style={{
                        backgroundColor: '#007bff',
                        color: 'white',
                        border: 'none',
                        padding: '8px 16px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '12px'
                      }}
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => eliminarSlide(slide._id)}
                      style={{
                        backgroundColor: '#dc3545',
                        color: 'white',
                        border: 'none',
                        padding: '8px 16px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '12px'
                      }}
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 
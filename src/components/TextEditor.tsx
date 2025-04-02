import { useState, useEffect } from "react";
import 'froala-editor/js/languages/de.js';
import 'froala-editor/js/plugins.pkgd.min.js';
import 'froala-editor/css/froala_style.min.css';
import 'froala-editor/css/froala_editor.pkgd.min.css';

import FroalaEditorComponent from 'react-froala-wysiwyg';

function FroalaEditor({ content, handleChangeContent }) {
  const [loading, setLoading] = useState(true);  // Estado para manejar la carga

  // Manejar la carga y retraso
  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoading(false);  // Después de 1 segundo, se cambia a 'false' para que se muestre el contenido
      const frWrapper = document.querySelector('.fr-wrapper');
      if (frWrapper) {
        const div = frWrapper.querySelector('div[style="z-index:9999;width:100%;position:relative"]');
        if (div) {
          const link = div.querySelector('a'); // Encuentra el enlace <a> dentro del div
          if (link) {
            link.textContent = ''; // Borra el texto dentro de <a>
            link.style.visibility = 'hidden'; // Hace que el enlace sea invisible pero mantiene su espacio
            link.style.fontSize = '-3px'; // Hace el enlace muy pequeño (si lo prefieres pequeño)
            link.style.margin = '0px';
            link.style.padding = '1px';
          } 
        }
      }
    }, 1000);

    // Limpiar el timeout si el componente se desmonta
    return () => clearTimeout(timeout);
  }, []);

  // Función que maneja el cambio de contenido solo si ya no estamos en el estado de carga
  function setEditorContent(newContent) {
    if (!loading) {  // Si no está cargando, permite manejar el cambio de contenido
      handleChangeContent(newContent);
    }
  }

  // Función que devuelve el contenido si no está en carga, de lo contrario retorna null
  function editorContent() {
    if (loading) return null;  // Durante el primer segundo no retorna contenido
    return content;  // Después de 1 segundo, retorna el contenido pasado como prop
  }

  return (
    <>
      <FroalaEditorComponent
        tag="textarea"
        model={editorContent()}  // Usa el contenido después del tiempo de carga
        onModelChange={(newContent) => {
          setEditorContent(newContent);  // Solo actualiza el contenido cuando no estamos en carga
        }}
      />
    </>
  );
}

export default FroalaEditor;

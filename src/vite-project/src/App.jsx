import { useState } from 'react';
import 'froala-editor/js/languages/de.js';
import 'froala-editor/js/third_party/spell_checker.min.js';
import 'froala-editor/js/plugins.pkgd.min.js';
import 'froala-editor/css/froala_style.min.css';
import 'froala-editor/css/froala_editor.pkgd.min.css';

import FroalaEditorComponent from 'react-froala-wysiwyg';

function App() {
  // Estado para manejar el contenido del editor
  const [content, setContent] = useState('<p>ghghthbthbhgbnhg bquí tu contenido...</p>');

  // Función que se ejecuta cuando el contenido cambia
  const handleModelChange = (newContent) => {
    setContent(newContent);
    console.log('Contenido actualizado:', newContent);
  };

  return (
    <>
      <FroalaEditorComponent 
        tag="textarea"
        model={content} 
        onModelChange={handleModelChange} 
      />
    </>
  );
}

export default App;

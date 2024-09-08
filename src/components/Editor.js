import React, { useState, useRef, useEffect } from "react";
import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css"; 
import katex from "katex";
import "katex/dist/katex.min.css";
window.katex = katex;

const FormulaBlot = Quill.import("formats/formula"); 

class CustomFormulaBlot extends FormulaBlot {
  static create(value) {
    const node = super.create(value);
    const formula = katex.renderToString(value, {
      throwOnError: false,
    });
    node.innerHTML = formula;
    return node;
  }

  static formats(node) {
    return node.innerText;
  }

  constructor(scroll, domNode) {
    super(scroll, domNode);
    this.quill = scroll.quill;
  }
}

CustomFormulaBlot.blotName = "formula";
CustomFormulaBlot.tagName = "span";

Quill.register(CustomFormulaBlot); 

const Editor = ({ lesson, setLesson, index }) => {
  const [content, setContent] = useState('');
  const quillRef = useRef(null); // Создание рефа для Quill  
  const limit = 2000; // Ограничение на количество символов 

  useEffect(() => {
    setContent(lesson.pages[index].texts);
  }, [lesson.pages, index]);

  const modules = {
    toolbar: [
      ["bold", "italic", "underline", "strike"], // кнопки формата  
      ["blockquote", "code-block"],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ script: "sub" }, { script: "super" }], // надстрочный/подстрочный текст  
      [{ header: [1, 2, 3, false] }],
      ["link", "formula"],
      [{ color: [] }, { background: [] }], // выпадающие списки с настройками  
      [{ align: [] }],
      ["clean"] // кнопка для удаления форматирования  
    ],
    clipboard: {
      matchVisual: false
    }
  };

  const handleChange = (html) => {
    const quill = quillRef.current.getEditor(); // Получение ссылки на редактор 
    if (quill.getLength() <= limit) {
      setContent(html); // Обновление контента  
      lesson.pages[index].texts = html;
      setLesson(lesson);
    } else if (quill.getLength() > limit) {
      quill.deleteText(limit, quill.getLength());
      setContent(quill.getText());
      lesson.pages[index].texts = quill.getText();
      setLesson(lesson);
    }
  };

  return (
    <div style={{ flexBasis: "85%",  display: "flex", flexDirection: "column", }}>
      <ReactQuill
        ref={quillRef}
        theme="snow"
        style={{ height: "90%" }}
        formats={['header', 'font', 'size', 'bold', 'italic', 'underline', 'strike', 'blockquote', 'list', 'bullet', 'indent', 'link', 'image', 'video', 'formula']}
        placeholder="Write something amazing..."
        modules={modules}
        bounds={".app"}
        onChange={handleChange}
        value={content}
      />
    </div>
  );
};

export default Editor;

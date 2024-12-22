import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

interface EditorProps {
  value: string;
  onChange: (value: string) => void;
}

export function QuillEditor({ value, onChange }: EditorProps) {
  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'align': [] }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'indent': '-1'}, { 'indent': '+1' }],
      ['blockquote', 'code-block'],
      ['link', 'image', 'video'],
      ['clean']
    ],
  };

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'color', 'background',
    'align',
    'list', 'bullet',
    'indent',
    'blockquote', 'code-block',
    'link', 'image', 'video'
  ];

  return (
    <ReactQuill 
      theme="snow"
      value={value}
      onChange={onChange}
      modules={modules}
      formats={formats}
      className="min-h-[400px]"
      style={{
        height: '400px',
        marginBottom: '50px'  // 为工具栏留出空间
      }}
    />
  );
} 
'use client'

import { Editor } from '@tinymce/tinymce-react';

export default function TextEditor({ value, onChange }) {
  const handleEditorChange = (content) => {
    onChange(content);
  };

  return (
    <Editor
      apiKey="lw6c6a4tc40q4gpe0kpwiopss9xfilf09drn9klv52vuydfb" // 需要从 TinyMCE 官网获取免费 API key
      init={{
        height: 500,
        menubar: true,
        plugins: [
          'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
          'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
          'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
        ],
        toolbar: 'undo redo | blocks | ' +
          'bold italic forecolor | alignleft aligncenter ' +
          'alignright alignjustify | bullist numlist outdent indent | ' +
          'removeformat | help',
        content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
      }}
      value={value}
      onEditorChange={handleEditorChange}
    />
  );
} 
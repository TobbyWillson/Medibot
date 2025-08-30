import React from "react";
import ReactMarkdownLib from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";

// 🎨 Custom styling map for markdown elements
const components = {
  h1: ({ node, ...props }) => <h1 className='text-3xl font-bold mt-4 mb-2' {...props} />,
  h2: ({ node, ...props }) => <h2 className='text-2xl font-semibold mt-4 mb-2' {...props} />,
  h3: ({ node, ...props }) => <h3 className='text-xl font-semibold mt-3 mb-2' {...props} />,
  h4: ({ node, ...props }) => <h4 className='text-lg font-semibold mt-3 mb-2' {...props} />,
  h5: ({ node, ...props }) => <h5 className='text-base font-semibold mt-2 mb-1' {...props} />,
  h6: ({ node, ...props }) => <h6 className='text-sm font-semibold mt-2 mb-1 text-gray-600' {...props} />,
  p: ({ node, ...props }) => <p className='text-base leading-relaxed mb-3' {...props} />,
  strong: ({ node, ...props }) => <strong className='font-bold' {...props} />,
  em: ({ node, ...props }) => <em className='italic' {...props} />,
  del: ({ node, ...props }) => <del className='line-through text-gray-500' {...props} />,
  a: ({ node, ...props }) => <a className='text-blue-600 hover:underline' target='_blank' rel='noopener noreferrer' {...props} />,
  code: ({ node, inline, className, children, ...props }) =>
    inline ? (
      <code className='bg-gray-100 rounded px-1 font-mono text-sm' {...props}>
        {children}
      </code>
    ) : (
      <pre className='bg-gray-900 text-gray-100 rounded-lg p-3 overflow-x-auto mb-4'>
        <code className='font-mono text-sm' {...props}>
          {children}
        </code>
      </pre>
    ),
  blockquote: ({ node, ...props }) => <blockquote className='border-l-4 border-gray-400 pl-4 italic text-gray-700 my-3' {...props} />,
  ul: ({ node, ...props }) => <ul className='list-disc list-inside pl-4 mb-3' {...props} />,
  ol: ({ node, ...props }) => <ol className='list-decimal list-inside pl-4 mb-3' {...props} />,
  li: ({ node, ...props }) => <li className='mb-1' {...props} />,
  hr: ({ node, ...props }) => <hr className='border-t border-gray-300 my-4' {...props} />,
  br: () => <br />,
};

function ReactMarkdown({ children, className, ...props }) {
  return (
    <div className={`prose max-w-none ${className || ""}`}>
      <ReactMarkdownLib remarkPlugins={[remarkGfm, remarkBreaks]} rehypePlugins={[rehypeRaw, rehypeSanitize]} components={components} {...props}>
        {children}
      </ReactMarkdownLib>
    </div>
  );
}

export default ReactMarkdown;

// Jest mock for react-markdown (ESM-only, not transformable by CRA's jest).
// Renders children as plain text so tests can assert on message content.
import React from 'react';

const ReactMarkdown = ({ children }) => <div>{children}</div>;

export default ReactMarkdown;

/* eslint-disable react/prop-types */
import React, { memo } from 'react';

/**
 * Renders content conditionally based on the value of `showContent`.
 *
 * @param {Object} props - The component props.
 * @param {boolean} props.showContent - Determines whether to render the content or the loading message.
 * @param {ReactNode} props.children - The content to be rendered.
 * @returns {ReactNode} - The rendered content or loading message.
 */
const ConditionalRenderer = ({ showContent, children }) => {
  return (
    <div>
      {showContent ? (
        children
      ) : (
        <h2 style={{ textAlign: 'center' }}>Caricamento...</h2>
      )}
    </div>
  );
};

export default memo(ConditionalRenderer);

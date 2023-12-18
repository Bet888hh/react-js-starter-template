/* eslint-disable react/prop-types */
import React, { memo } from 'react';

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

/* eslint-disable react/prop-types */
import React, { memo, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ProtectedRoute = ({ condition, redirectTo, children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!condition) {
      navigate(redirectTo);
    }
  }, [condition, navigate, redirectTo]);

  return condition ? children : null;
};
export default memo(ProtectedRoute);

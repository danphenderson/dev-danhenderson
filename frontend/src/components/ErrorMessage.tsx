import React from "react";

interface ErrorMessageProps {
  message: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => (
  <p className="has-text-weight-bold has-text-danger">{message}</p>
);

export default ErrorMessage;
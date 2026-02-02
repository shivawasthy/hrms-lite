import React from 'react';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';

export default function Alert({ type = 'success', message, onClose }) {
  const icons = {
    success: CheckCircle,
    error: XCircle,
    warning: AlertCircle,
  };

  const Icon = icons[type];

  return (
    <div className={`alert alert-${type}`}>
      <Icon size={20} />
      <span>{message}</span>
    </div>
  );
}

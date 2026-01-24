const Alert = ({ type = 'info', message, onClose }) => {
  const bgColors = {
    success: 'bg-green-100 border-green-400 text-green-700',
    error: 'bg-red-100 border-red-400 text-red-700',
    warning: 'bg-yellow-100 border-yellow-400 text-yellow-700',
    info: 'bg-purple-100 border-purple-400 text-purple-700',
  };

  return (
    <div
      className={`border-l-4 p-4 mb-4 ${bgColors[type]} ${
        onClose ? 'relative' : ''
      }`}
      role="alert"
    >
      <div className="flex justify-between items-center">
        <p>{message}</p>
        {onClose && (
          <button
            onClick={onClose}
            className="ml-4 text-lg font-bold hover:opacity-75"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
};

export default Alert;

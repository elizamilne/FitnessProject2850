const Modal = ({ isOpen, onClose, header, body, footer }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="relative bg-white rounded-2xl shadow-lg w-full max-w-2xl max-h-[80vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        {header && (
          <div className="p-4 border-b flex justify-between items-center">
            {header}
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-black text-lg"
            >
              ✕
            </button>
          </div>
        )}

        {/* Body */}
        <div className="p-4 overflow-y-auto flex-1">
          {body}
        </div>

        {/* Footer */}
        {footer && (
          <div className="p-4 border-t">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
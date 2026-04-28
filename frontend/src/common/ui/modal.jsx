import { createPortal } from "react-dom";

const Modal = ({ isOpen, onClose, header, body, footer }) => {
  if (!isOpen) return null;

  if (typeof window === "undefined") return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <div
        className="relative bg-white rounded-2xl shadow-lg w-full max-w-2xl max-h-[80vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {header && (
          <div className="p-4 border-b flex justify-between items-center">
            {header}
            <button onClick={onClose}>✕</button>
          </div>
        )}

        <div className="p-4 overflow-y-auto flex-1">{body}</div>

        {footer && <div className="p-4 border-t">{footer}</div>}
      </div>
    </div>,
    document.body
  );
};

export default Modal;
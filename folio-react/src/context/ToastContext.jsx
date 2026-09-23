import { createContext, useCallback, useContext, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

const ToastContext = createContext(null);
let nextId = 1;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const timers = useRef({});

  const remove = useCallback((id) => {
    setToasts((list) => list.map((t) => (t.id === id ? { ...t, leaving: true } : t)));
    setTimeout(() => setToasts((list) => list.filter((t) => t.id !== id)), 220);
  }, []);

  const show = useCallback(
    (message, type = 'info') => {
      const id = nextId++;
      setToasts((list) => [...list, { id, message, type, leaving: false }]);
      timers.current[id] = setTimeout(() => remove(id), 3400);
    },
    [remove]
  );

  const value = useCallback(
    (message) => show(message, 'info'),
    [show]
  );
  value.error = (message) => show(message, 'error');
  value.success = (message) => show(message, 'success');

  return (
    <ToastContext.Provider value={value}>
      {children}
      {createPortal(
        <div id="toasts">
          {toasts.map((t) => (
            <div key={t.id} className={`toast ${t.type === 'error' ? 'error' : ''} ${t.leaving ? 'leave' : ''}`}>
              {t.message}
            </div>
          ))}
        </div>,
        document.body
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}

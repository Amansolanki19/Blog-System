import { createContext, useCallback, useContext, useState } from 'react';
import { createPortal } from 'react-dom';

const ConfirmContext = createContext(null);

export function ConfirmProvider({ children }) {
  const [dialog, setDialog] = useState(null); // { title, body, confirmText, danger, resolve }

  const confirm = useCallback(
    ({ title, body, confirmText = 'Confirm', danger = false }) =>
      new Promise((resolve) => {
        setDialog({ title, body, confirmText, danger, resolve });
      }),
    []
  );

  function close(result) {
    dialog?.resolve(result);
    setDialog(null);
  }

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      {dialog &&
        createPortal(
          <div className="modal-root open">
            <div className="modal-overlay" onClick={() => close(false)} />
            <div className="modal-box" role="dialog" aria-modal="true">
              <h3>{dialog.title}</h3>
              <p>{dialog.body}</p>
              <div className="modal-actions">
                <button className="btn btn-ghost btn-sm" onClick={() => close(false)}>
                  Cancel
                </button>
                <button
                  className={`btn ${dialog.danger ? 'btn-danger' : 'btn-primary'} btn-sm`}
                  onClick={() => close(true)}
                >
                  {dialog.confirmText}
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </ConfirmContext.Provider>
  );
}

export function useConfirm() {
  const ctx = useContext(ConfirmContext);
  if (!ctx) throw new Error('useConfirm must be used within ConfirmProvider');
  return ctx;
}

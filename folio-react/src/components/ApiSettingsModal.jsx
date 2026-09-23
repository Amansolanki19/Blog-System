import { useState } from 'react';
import { createPortal } from 'react-dom';
import { storage } from '../api/storage';
import { useToast } from '../context/ToastContext';

export default function ApiSettingsModal({ onClose, onSaved }) {
  const [value, setValue] = useState(storage.apiBase);
  const toast = useToast();

  function save() {
    const v = value.trim().replace(/\/$/, '');
    if (v) {
      storage.apiBase = v;
      toast.success('API address updated');
      onSaved?.(v);
    }
    onClose();
  }

  return createPortal(
    <div className="modal-root open">
      <div className="modal-overlay" onClick={onClose} />
      <div className="modal-box" role="dialog" aria-modal="true">
        <h3>Backend address</h3>
        <p>BackendBytes' React frontend is separate from your Spring Boot API — point it at where the API is running.</p>
        <div className="field">
          <label>API base URL</label>
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="http://localhost:1912"
            onKeyDown={(e) => e.key === 'Enter' && save()}
            autoFocus
          />
        </div>
        <div className="modal-actions">
          <button className="btn btn-ghost btn-sm" onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn-primary btn-sm" onClick={save}>
            Save
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

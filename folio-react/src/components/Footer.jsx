import { useState } from 'react';
import { storage } from '../api/storage';
import ApiSettingsModal from './ApiSettingsModal';

export default function Footer() {
  const [open, setOpen] = useState(false);
  const [apiBase, setApiBase] = useState(storage.apiBase);

  return (
    <footer>
      <div className="footer-inner">
        <span>BackendBytes — a small place to write.</span>
        <button onClick={() => setOpen(true)}>API: {apiBase}</button>
      </div>
      {open && <ApiSettingsModal onClose={() => setOpen(false)} onSaved={setApiBase} />}
    </footer>
  );
}

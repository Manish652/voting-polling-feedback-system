import { useState, useEffect } from 'react';

let showAlert = null;
let showConfirm = null;

export function useAlert() {
  return {
    showAlert: (message, type = 'info') => {
      if (showAlert) showAlert(message, type);
    },
    showConfirm: (message, onConfirm, onCancel) => {
      if (showConfirm) showConfirm(message, onConfirm, onCancel);
    }
  };
}

export default function AlertProvider() {
  const [alert, setAlert] = useState(null);
  const [confirm, setConfirm] = useState(null);

  useEffect(() => {
    showAlert = (message, type) => {
      setAlert({ message, type });
      setTimeout(() => setAlert(null), 4000);
    };

    showConfirm = (message, onConfirm, onCancel) => {
      setConfirm({
        message,
        onConfirm: () => {
          onConfirm();
          setConfirm(null);
        },
        onCancel: () => {
          if (onCancel) onCancel();
          setConfirm(null);
        }
      });
    };

    return () => {
      showAlert = null;
      showConfirm = null;
    };
  }, []);

  return (
    <>
      {/* Alert Toast */}
      {alert && (
        <div className="toast toast-top toast-end z-50 mt-20">
          <div
            className={`alert ${
              alert.type === 'success'
                ? 'alert-success'
                : alert.type === 'error'
                ? 'alert-error'
                : alert.type === 'warning'
                ? 'alert-warning'
                : 'alert-info'
            }`}
          >
            <span>{alert.message}</span>
            <button
              className="btn btn-sm btn-circle btn-ghost"
              onClick={() => setAlert(null)}
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Confirm Modal */}
      {confirm && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Confirm Action</h3>
            <p className="py-4">{confirm.message}</p>
            <div className="modal-action">
              <button className="btn btn-ghost" onClick={confirm.onCancel}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={confirm.onConfirm}>
                Confirm
              </button>
            </div>
          </div>
          <div className="modal-backdrop" onClick={confirm.onCancel}></div>
        </div>
      )}
    </>
  );
}

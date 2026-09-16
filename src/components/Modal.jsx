import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import { X } from 'lucide-react'

const SIZES = {
  sm: 'max-w-sm',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
}

export default function Modal({ open, onClose, title, description, children, size = 'md' }) {
  return (
    <Dialog open={open} onClose={onClose} className="relative z-50">
      <DialogBackdrop className="fixed inset-0 bg-slate-900/40 transition-opacity duration-150 data-closed:opacity-0" />
      <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
        <DialogPanel
          className={`w-full ${SIZES[size]} max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-6 shadow-xl transition duration-150 data-closed:scale-95 data-closed:opacity-0`}
        >
          <div className="mb-4 flex items-start justify-between gap-4">
            <div>
              <DialogTitle className="text-lg font-semibold text-slate-900">{title}</DialogTitle>
              {description && <p className="mt-1 text-sm text-slate-500">{description}</p>}
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
          {children}
        </DialogPanel>
      </div>
    </Dialog>
  )
}

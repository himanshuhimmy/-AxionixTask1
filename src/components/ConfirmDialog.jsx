import Modal from './Modal'
import Button from './Button'

export default function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  isLoading,
  title,
  description,
  confirmLabel = 'Delete permanently',
  loadingLabel = 'Deleting…',
}) {
  return (
    <Modal open={open} onClose={onClose} title={title} size="sm">
      <p className="text-sm text-slate-600">{description}</p>
      <div className="mt-5 flex justify-end gap-3">
        <Button type="button" variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button type="button" variant="danger" isLoading={isLoading} onClick={onConfirm}>
          {isLoading ? loadingLabel : confirmLabel}
        </Button>
      </div>
    </Modal>
  )
}

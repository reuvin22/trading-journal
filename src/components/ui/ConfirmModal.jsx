import Modal from './Modal'

export default function ConfirmModal({
  open,
  onClose,
  onConfirm,
  title = 'Are you sure?',
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  tone = 'default',
}) {
  const confirmClasses =
    tone === 'danger' ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-accent text-[#06110b] hover:opacity-90'

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      size="sm"
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded-md border border-border px-3 py-2 text-sm font-medium text-text hover:bg-surface-2"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm?.()
              onClose?.()
            }}
            className={`cursor-pointer rounded-md px-3 py-2 text-sm font-semibold transition-opacity ${confirmClasses}`}
          >
            {confirmLabel}
          </button>
        </>
      }
    >
      {description && <p className="text-sm text-text-muted">{description}</p>}
    </Modal>
  )
}

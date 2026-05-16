export default function Modal({ open, onClose, children, wide = false }) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/45 p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className={`w-full max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-8 shadow-2xl ${
          wide ? "max-w-[720px]" : "max-w-[500px]"
        }`}
      >
        {children}
      </div>
    </div>
  );
}

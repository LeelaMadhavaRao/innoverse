import { forwardRef } from 'react';
import { cn } from '../../lib/utils';

const Dialog = forwardRef(({ className, open, onClose, children, ...props }, ref) => {
  if (!open) return null;

  return (
    <>
      <div className="dialog-overlay" onClick={onClose} />
      <div
        ref={ref}
        className={cn('dialog', className)}
        {...props}
      >
        {children}
      </div>
    </>
  );
});

Dialog.displayName = 'Dialog';

export { Dialog };

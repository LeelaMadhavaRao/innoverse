import { forwardRef } from 'react';
import { cn } from '../../lib/utils';

const Select = forwardRef(({ className, children, ...props }, ref) => {
  return (
    <select
      className={cn('select', className)}
      ref={ref}
      {...props}
    >
      {children}
    </select>
  );
});

Select.displayName = 'Select';

export { Select };

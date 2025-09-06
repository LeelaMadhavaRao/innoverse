import { forwardRef } from 'react';
import { cn } from '../../lib/utils';

const Button = forwardRef(({ 
  className, 
  variant = 'default', 
  size = 'default', 
  asChild = false,
  ...props 
}, ref) => {
  const Comp = asChild ? 'span' : 'button';
  
  return (
    <Comp
      className={cn(
        'button',
        `button-${variant}`,
        `button-${size}`,
        className
      )}
      ref={ref}
      {...props}
    />
  );
});

Button.displayName = 'Button';

export { Button };

import React from 'react';
import './index.css';

type NavigationArrowPreviousProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

const NavigationArrowPrevious = (props: NavigationArrowPreviousProps) => {
  return (
    <button 
      className={`navigation-arrow navigation-arrow-prev ${props.disabled ? 'disabled' : ''}`}
      onClick={props.onClick}
      disabled={props.disabled}
      aria-label="Previous slide"
      {...props}
    >
      &#8249;
    </button>
  );
};

export default NavigationArrowPrevious;


import React from 'react';
import './index.css';

type NavigationArrowNextProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

const NavigationArrowNext = (props: NavigationArrowNextProps) => {
  return (
    <button 
      className={`navigation-arrow navigation-arrow-next ${props.disabled ? 'disabled' : ''}`}
      onClick={props.onClick}
      disabled={props.disabled}
      aria-label="Next slide"
      {...props}
    >
      &#8250;
    </button>
  );
};

export default NavigationArrowNext;


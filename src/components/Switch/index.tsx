import React from 'react';
import './index.css';

interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
}

const Switch: React.FC<SwitchProps> = ({ 
  checked, 
  onChange, 
  label,
  disabled = false 
}) => {
  const handleToggle = (): void => {
    if (!disabled) {
      onChange(!checked);
    }
  };

  return (
    <div className="switch-container">
      {label && <span className="switch-label">{label}</span>}
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        className={`switch ${checked ? 'switch-on' : 'switch-off'} ${disabled ? 'switch-disabled' : ''}`}
        onClick={handleToggle}
        disabled={disabled}
      >
        <span className="switch-slider" />
      </button>
    </div>
  );
};

export default Switch;


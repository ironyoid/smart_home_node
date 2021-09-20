import { useState } from "react";

const Toggler = ({ info }) => {
  const [checked, setChecked] = useState(!!(info.state === "on"));
  const onChange = () => {
    setChecked(!checked);
  };

  return (
    <label className="toggler">
      <span className="toggler__label">{info.label}</span>
      <input
        type="checkbox"
        className="toggler__control"
        checked={checked}
        onChange={onChange}
      />
    </label>
  );
};

export default Toggler;

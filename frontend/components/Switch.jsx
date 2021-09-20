import { useState, useLayoutEffect, useRef } from "react";

const Switch = ({ info }) => {
  const ref = useRef();
  const [checked, setChecked] = useState(!!(info.state === "on"));
  const onChange = () => {
    setChecked(!checked);
  };

  useLayoutEffect(() => {
    const siblings = info.dependingFor.map(
      (index) => ref.current.parentNode.childNodes[index]
    );

    siblings.forEach((sibling) => {
      sibling.querySelector("input").disabled = !checked;
      checked
        ? sibling.classList.remove("disabled")
        : sibling.classList.add("disabled");
    });
  }, [checked]);

  return (
    <label className="switch" ref={ref}>
      <span className="switch__label">{info.label}</span>
      <input
        type="checkbox"
        className="switch__control"
        checked={checked}
        onChange={onChange}
      />
    </label>
  );
};

export default Switch;

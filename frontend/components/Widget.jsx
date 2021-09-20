import Switch from "./Switch";
import Toggler from "./Toggler";

const Widget = ({ info }) => {
  return (
    <section className="widget">
      {info.title && <h3 className="widget__title">{info.title}</h3>}
      <div className="widget__controls">
        {info.controls.map((control) => {
          if (control.type === "switch")
            return <Switch info={control} key={control.label} />;

          if (control.type === "toggler")
            return <Toggler info={control} key={control.label} />;
        })}
      </div>
    </section>
  );
};

export default Widget;

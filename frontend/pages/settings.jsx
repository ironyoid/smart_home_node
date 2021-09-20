import Layout from "../components/Layout";
import Widget from "../components/Widget";

const widgets = [
  {
    controls: [
      {
        label: "Lamp schedule",
        state: "off",
        type: "switch",
        dependingFor: [1, 2],
      },
      { label: "Weekday time", state: "on", type: "toggler" },
      { label: "Weekend time", state: "off", type: "toggler" },
    ],
  },
];

const SettingsPage = () => {
  return (
    <Layout title="Settings">
      <h1>Smart Home Node</h1>
      <div className="widget-container container">
        {widgets.map((widget) => (
          <Widget key={widget.title + widget.controls.length} info={widget} />
        ))}
      </div>
    </Layout>
  );
};

export default SettingsPage;

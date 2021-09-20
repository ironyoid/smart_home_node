import Layout from "../components/Layout";
import Widget from "../components/Widget";

const widgets = [
  {
    title: "Watering",
    controls: [
      { label: "Pump", state: "on", type: "switch" },
      { label: "Plants", state: "off", type: "switch" },
      { label: "Shower", state: "off", type: "switch" },
      { label: "Children", state: "on", type: "switch" },
    ],
  },
  {
    title: "Lamps",
    controls: [
      { label: "IR Lamp", state: "off", type: "switch" },
      { label: "Wireless lamp", state: "off", type: "switch" },
      { label: "Kitchen", state: "off", type: "switch" },
      { label: "LED", state: "on", type: "switch" },
      { label: "Main light", state: "off", type: "switch" },
    ],
  },
  {
    title: "Music",
    controls: [
      { label: "Main", state: "on", type: "switch" },
      { label: "Background", state: "off", type: "switch" },
    ],
  },
  {
    title: "Ventilation",
    controls: [
      { label: "Windows", state: "on", type: "switch" },
      { label: "Doors", state: "off", type: "switch" },
      { label: "A/C", state: "off", type: "switch" },
    ],
  },
];

const MainPage = () => {
  return (
    <Layout title="Controls">
      <h1>Smart Home Node</h1>
      <div className="widget-container container">
        {widgets.map((widget) => (
          <Widget key={widget.title + widget.controls.length} info={widget} />
        ))}
      </div>
    </Layout>
  );
};

export default MainPage;

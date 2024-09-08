import DummyData from "./dummy.json";
import "./App.css";

const infoArray = DummyData.info;

const App = () => {
  return (
    <div>
      <h1>Dynamic Form</h1>
      <form>
        {infoArray.map((field, id) => (
          <div key={id}>
            <label>{field.name}</label>
            <input type="text" name={field.symbol} />
          </div>
        ))}
      </form>
    </div>
  );
};

export default App;

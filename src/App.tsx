import DummyData from "./dummy.json";
import { Formik, Form, Field } from "formik";
import "./App.css";

const infoArray = DummyData.info;

const App = () => {
  // Create initial values from the JSON
  const initialValues = infoArray.reduce((acc, field) => {
    acc[field.symbol] = field.defaultValue || ""; // Use defaultValue or empty string
    return acc;
  }, {});

  // Helper function to determine input field type
  const getInputField = (field) => {
    switch (field.type) {
      case "C":
        return <Field type="checkbox" name={field.symbol} />;
      case "T":
        return <Field type="text" name={field.symbol} />;
      case "N":
        return <Field type="number" name={field.symbol} />;
      case "D":
        return <Field type="date" name={field.symbol} />;
      case "U":
        return <Field type="file" name={field.symbol} />;
      case "A":
        return <Field as="textarea" name={field.symbol} />;
      default:
        return <Field type="text" name={field.symbol} />;
    }
  };

  const handleSubmit = (values) => {
    console.log("Form values:", values);
  };

  return (
    <div>
      <h1>Dynamic Form</h1>
      {/* Formik wrapper */}
      <Formik initialValues={initialValues} onSubmit={handleSubmit}>
        {({ values }) => (
          <Form>
            {infoArray.map((field, index) => (
              <div key={index}>
                <label>{field.name}</label>
                {getInputField(field)}
              </div>
            ))}
            <button type="submit">Submit</button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default App;

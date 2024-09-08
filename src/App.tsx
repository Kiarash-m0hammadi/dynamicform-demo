import DummyData from "./dummy.json";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import "./App.css";

const infoArray = DummyData.info;

// Helper function to extract 'count' from the attribute string
const extractCount = (attribute) => {
  if (!attribute) return null;
  const countMatch = attribute.match(/count:(\d+)/);
  return countMatch ? parseInt(countMatch[1], 10) : null;
};

// Create the Yup validation schema based on the infoArray
const createValidationSchema = (infoArray) => {
  const shape = {};

  infoArray.forEach((field) => {
    let validationRule = Yup.mixed();

    if (field.isRequired === "Y") {
      validationRule = validationRule.required(`${field.name} is required`);
    }

    if (field.type === "T" || field.type === "A") {
      validationRule = Yup.string();
      const count = extractCount(field.attribute);
      if (count) {
        validationRule = validationRule.max(
          count,
          `${field.name} cannot exceed ${count} characters`
        );
      }
    } else if (field.type === "N") {
      validationRule = Yup.number().typeError(
        `${field.name} must be a valid number`
      );
      const count = extractCount(field.attribute);
      if (count) {
        validationRule = validationRule.test(
          "maxDigits",
          `${field.name} must be exactly ${count} digits`,
          (value) => value && value.toString().length <= count
        );
      }
    } else if (field.type === "D") {
      validationRule = Yup.date().typeError(
        `${field.name} must be a valid date`
      );
    }

    shape[field.symbol] = validationRule;
  });

  return Yup.object().shape(shape);
};

const App = () => {
  // Create initial values from the JSON
  const initialValues = infoArray.reduce((acc, field) => {
    acc[field.symbol] = field.defaultValue || "";
    return acc;
  }, {});

  // Create validation schema dynamically based on the JSON
  const validationSchema = createValidationSchema(infoArray);

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
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, errors, touched }) => (
          <Form>
            {infoArray.map((field, index) => (
              <div key={index}>
                <label>{field.name}</label>
                {getInputField(field)}
                {errors[field.symbol] && touched[field.symbol] && (
                  <div style={{ color: "red" }}>{errors[field.symbol]}</div>
                )}
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

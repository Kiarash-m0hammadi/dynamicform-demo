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
  const infoArray = DummyData.info;

  // Create initial values from the JSON and convert checkboxes to boolean values
  const initialValues = infoArray.reduce((acc, field) => {
    if (field.type === "C") {
      acc[field.symbol] = field.defaultValue === "Y" ? true : false; // Convert Y/N to boolean
    } else {
      acc[field.symbol] = field.defaultValue || "";
    }
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

  const handleFileUpload = (file) => {
    // You can handle the file here (e.g., save it to a server or display it)
    console.log("Uploaded file:", file);
    return file.name; // For simplicity, we return the file name as the value
  };

  const handleSubmit = (values) => {
    // Convert boolean checkbox values back to Y/N and handle the file input
    const convertedValues = Object.keys(values).reduce((acc, key) => {
      const field = infoArray.find((f) => f.symbol === key);
      if (field && field.type === "C") {
        acc[key] = values[key] ? "Y" : "N"; // Convert true/false back to Y/N
      } else if (field && field.type === "U") {
        acc[key] = handleFileUpload(values[key]); // Save the file in the same directory
      } else {
        acc[key] = values[key];
      }
      return acc;
    }, {});

    // Save JSON file
    const jsonData = JSON.stringify(convertedValues, null, 2);
    const blob = new Blob([jsonData], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "form-data.json";
    link.click();

    console.log("Form values saved as JSON:", convertedValues);
  };

  return (
    <div>
      <h1>Dynamic Form</h1>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, errors, touched, setFieldValue }) => (
          <Form>
            {infoArray.map((field, index) => (
              <div key={index}>
                <label>{field.name}</label>
                {getInputField(field)}
                {/* Display validation errors */}
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

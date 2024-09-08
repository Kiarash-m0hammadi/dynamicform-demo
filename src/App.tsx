const App = () => {
  // Helper function to determine input type
  const getInputField = (field) => {
    switch (field.type) {
      case "C":
        return <input type="checkbox" name={field.symbol} />;
      case "T":
        return <input type="text" name={field.symbol} />;
      case "N":
        return <input type="number" name={field.symbol} />;
      case "D":
        return <input type="date" name={field.symbol} />;
      case "U":
        return <input type="file" name={field.symbol} />;
      case "A":
        return <textarea name={field.symbol} />;
      default:
        return <input type="text" name={field.symbol} />; // Default to text if unknown type
    }
  };

  return (
    <div>
      <h1>Dynamic Form</h1>
      <form>
        {infoArray.map((field, index) => (
          <div key={index}>
            {/* Render label */}
            <label>{field.name}</label>
            {/* Render input field based on the type */}
            {getInputField(field)}
          </div>
        ))}
      </form>
    </div>
  );
};

export default App;

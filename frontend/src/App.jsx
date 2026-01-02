import Button from "./components/Button";
import { Eye } from "lucide-react";
import "./App.css";

function App() {
  return (
    <>
      <Button variant="outline" size="sm">
        <Eye size={14} className="mr-1" /> View Receipt
      </Button>
    </>
  );
}

export default App;

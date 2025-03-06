import FileUpload from "../components/FileUpload";
import Navbar from "../components/Navbar";

const Upload = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-950 py-12">
      <div className=" mx-auto">
        <Navbar />
        <FileUpload />
      </div>
    </div>
  );
};

export default Upload;
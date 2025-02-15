import FileUpload from "../components/FileUpload";

const Upload = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Upload Questions Bank
        </h1>
        <FileUpload />
      </div>
    </div>
  );
};

export default Upload;
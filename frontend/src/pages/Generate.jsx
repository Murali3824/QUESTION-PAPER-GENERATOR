import { useState } from "react";
import GeneratePaper from "../components/GeneratePaper";
import DisplayPaper from "../components/DisplayPaper";

const Generate = () => {
  const [questions, setQuestions] = useState(null);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Question Paper Generator</h1>
        <GeneratePaper setQuestions={setQuestions} />
        {questions && <DisplayPaper questions={questions} />}
      </div>
    </div>
  );
};

export default Generate;
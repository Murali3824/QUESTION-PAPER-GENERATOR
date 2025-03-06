import { useState } from "react";
import GeneratePaper from "../components/GeneratePaper";
import DisplayPaper from "../components/DisplayPaper";
import Navbar from "../components/Navbar";

const Generate = () => {
  const [questions, setQuestions] = useState(null);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-950 py-8">
      <div className=" mx-auto">
        <Navbar />
        <GeneratePaper setQuestions={setQuestions} />
        {questions && <DisplayPaper questions={questions} />}
      </div>
    </div>
  );
};

export default Generate;
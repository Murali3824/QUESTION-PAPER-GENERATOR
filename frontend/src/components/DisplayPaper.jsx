const DisplayPaper = ({ questions }) => {
    // console.log("Questions received by DisplayPaper:", questions);
  
    if (!questions) return null;
  
    return (
      <div className="w-full max-w-4xl mx-auto mt-8 bg-white rounded-lg shadow-md p-6">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold">{questions.metadata.subject}</h2>
          <p className="text-gray-600">
            {questions.metadata.branch} - {questions.metadata.regulation} - Year {questions.metadata.year}
          </p>
          <p className="text-gray-600">
            Semester {questions.metadata.semester} - Unit {questions.metadata.unit}
          </p>
        </div>
  
        <div className="space-y-6">
          {/* Short Answer Questions */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Part A - Short Answer Questions</h3>
            <div className="space-y-3">
              {questions.shortAnswers.map((q) => (
                <div key={q.number} className="p-3 bg-gray-50 rounded-md">
                  <div className="flex items-start">
                    <span className="font-medium mr-2">{q.number}.</span>
                    <div>
                      <p>{q.question}</p>
                      <p className="text-sm text-gray-600 mt-1">
                        BT Level: {q.btLevel} | Unit: {q.unit}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
  
          {/* Long Answer Questions */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Part B - Long Answer Questions</h3>
            <div className="space-y-3">
              {questions.longAnswers.map((q) => (
                <div key={q.number} className="p-3 bg-gray-50 rounded-md">
                  <div className="flex items-start">
                    <span className="font-medium mr-2">{q.number}.</span>
                    <div>
                      <p>{q.question}</p>
                      <p className="text-sm text-gray-600 mt-1">
                        BT Level: {q.btLevel} | Unit: {q.unit}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
  
        <div className="mt-6 text-right text-sm text-gray-600">
          Total Questions: {questions.metadata.totalQuestions}
        </div>
      </div>
    );
  };
  export default DisplayPaper;
  
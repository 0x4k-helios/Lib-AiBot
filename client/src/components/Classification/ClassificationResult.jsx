// ClassificationResult component to display the classification result
function ClassificationResult({ classification }) {
  return (
    <div className="rounded-lg bg-gray-100 p-4 dark:bg-gray-700">
      <h2 className="mb-2 text-lg font-semibold">
        Classification Result{" "}
        <span className="block text-sm italic text-gray-500">
          This is dummy data for demo purposes
        </span>
      </h2>
      {classification ? (
        // Display classification results if available
        <div className="space-y-2 text-xl">
          <p>
            <span className="font-semibold">DDC:</span> {classification.ddc}
          </p>
          <p>
            <span className="font-semibold">LCC:</span> {classification.lcc}
          </p>
        </div>
      ) : (
        // Display a message if no classification results are available
        <p className="text-gray-500 dark:text-gray-400">
          Classification results will appear here after submission.
        </p>
      )}
    </div>
  );
}

export default ClassificationResult;

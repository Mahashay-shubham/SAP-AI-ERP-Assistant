import { useState } from "react";

function AIAssistant() {
    const [question, setQuestion] = useState("");
    const [response, setResponse] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const askAI = async () => {
        if (!question.trim()) {
            setError("Please enter a question.");
            return;
        }

        setLoading(true);
        setResponse("");
        setError("");

        try {
            const token = localStorage.getItem("token");

            const result = await fetch(
                "http://localhost:8080/api/ai/ask",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        question: question,
                    }),
                }
            );

            if (!result.ok) {
                throw new Error(
                    `Request failed with status ${result.status}`
                );
            }

            const data = await result.text();

            setResponse(data);
        } catch (err) {
            setError(
                "Unable to get AI response. Please check the backend."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900">
                AI ERP Assistant
            </h1>

            <p className="mt-2 text-gray-600">
                Ask questions and get AI-powered ERP assistance.
            </p>

            <div className="mt-6">
                <textarea
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="Ask something about your ERP data..."
                    className="w-full min-h-32 rounded-lg border border-gray-300 p-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                <button
                    onClick={askAI}
                    disabled={loading}
                    className="mt-3 rounded-lg bg-blue-600 px-6 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                >
                    {loading ? "Thinking..." : "Ask AI"}
                </button>
            </div>

            {error && (
                <div className="mt-4 rounded-lg border border-red-300 bg-red-50 p-4 text-red-700">
                    {error}
                </div>
            )}

            {response && (
                <div className="mt-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                    <h2 className="text-lg font-semibold text-gray-900">
                        AI Response
                    </h2>

                    <p className="mt-3 whitespace-pre-wrap text-gray-700">
                        {response}
                    </p>
                </div>
            )}
        </div>
    );
}

export default AIAssistant;
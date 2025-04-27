function Verify() {
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            <p className="text-lg font-semibold text-gray-800">
                Please check your email to verify your signup.
            </p>
            <button 
                onClick={() => window.open('https://mail.google.com/', '_blank')}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-700 transition"
            >
                Open Gmail
            </button>
        </div>
    );
}

export default Verify;

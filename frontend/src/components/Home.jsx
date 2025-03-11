import { useState } from "react";
import FileUpload from "../components/FileUpload.jsx";
import ModelViewer from "../components/ModelViewer.jsx";

const Home = () => {
  const [file, setFile] = useState("");
  const [fileName, setFileName] = useState("");

  const handleFileUpload = (filename, originalName) => {
    setFile(`http://127.0.0.1:5000/files/${filename}`);
    setFileName(originalName || filename);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-gray-50 to-white shadow-md border-b border-gray-200">
        <div className="container mx-auto px-6 py-4 max-w-7xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Eye Icon for "Visual Eyes" */}
            <svg
              className="w-8 h-8 text-indigo-600"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4.5C7.605 4.5 4 8.056 4 12s3.605 7.5 8 7.5 8-3.556 8-7.5-3.605-7.5-8-7.5zM12 15a3 3 0 110-6 3 3 0 010 6z"
              />
            </svg>

            <h1 className="text-2xl font-extrabold text-gray-900 tracking-wide">
              Visual Eyes
            </h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-6 max-w-7xl">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h2 className="text-xl font-medium text-gray-800 mb-4">
                Upload Model
              </h2>
              <FileUpload onUpload={handleFileUpload} />
            </div>

            {file && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-medium text-gray-800 mb-4">
                  Model Info
                </h2>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      File Name
                    </p>
                    <p className="text-sm text-gray-800">{fileName}</p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Controls
                    </p>
                    <ul className="text-sm text-gray-600 list-disc pl-5 mt-1">
                      <li>Left click: Rotate</li>
                      <li>Right click: Pan</li>
                      <li>Scroll: Zoom</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="md:col-span-2">
            {file ? (
              <div className="bg-white rounded-lg shadow-sm h-[700px] overflow-hidden">
                <ModelViewer fileUrl={file} />
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm p-8 h-[700px] flex flex-col items-center justify-center text-center">
                <svg
                  className="w-20 h-20 text-gray-300 mb-4"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
                  />
                </svg>
                <h3 className="text-xl font-medium text-gray-700 mb-2">
                  No Model Selected
                </h3>
                <p className="text-gray-500 max-w-md">
                  Upload an STL file using the panel on the left to view and
                  interact with your 3D model.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-100 py-8">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-600 mb-4 md:mb-0 font-medium">
              &copy; {new Date().getFullYear()} Visual Eyes. All rights reserved.
            </p>
            <div className="flex space-x-8">
              <a 
                href="#" 
                className="text-gray-500 hover:text-gray-900 transition-colors duration-200"
                aria-label="GitHub"
              >
                <span className="sr-only">GitHub</span>
                <svg 
                  className="h-6 w-6" 
                  fill="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path
                    fillRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;

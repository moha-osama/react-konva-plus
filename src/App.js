import "./App.css";
import { useState } from "react";
import { Route, Routes } from "react-router";

import Edit from "./pages/Edit";
import Home from "./pages/Home";
import Preview from "./pages/Preview";

function App() {
  const [fileName, setFileName] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [videoName, setVideoName] = useState(null);
  const [shapesUID, setShapesUID] = useState(null);
  const [folderUid, setFolderUid] = useState(null);
  const [totalUploadedImages, setTotalUploadedImages] = useState(null);

  return (
    <Routes>
      <Route
        path="/"
        element={
          <Home setFileName={setFileName} setUploadedFile={setUploadedFile} />
        }
      />
      <Route
        path="/edit"
        element={
          <Edit
            fileName={fileName}
            uploadedFile={uploadedFile}
            setVideoName={setVideoName}
            setShapesUID={setShapesUID}
            setFolderUid={setFolderUid}
            setTotalUploadedImages={setTotalUploadedImages}
          />
        }
      />
      <Route
        path="/preview"
        element={
          <Preview
            videoName={videoName}
            shapesUID={shapesUID}
            folderUid={folderUid}
            totalUploadedImages={totalUploadedImages}
          />
        }
      />
    </Routes>
  );
}

export default App;

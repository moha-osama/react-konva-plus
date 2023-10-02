import "../App.css";
import React, { useState } from "react";

import { useNavigate } from "react-router";
import DropzoneArea from "../components/DropzoneArea";

const Home = ({ setFileName, setUploadedFile }) => {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);

  //uploading the video and nav to edit page with the video data
  const buttonClickHandler = async () => {
    if (file === null) return;
    // const fileRef = ref(storage, file.name);
    // const uploadTask = uploadBytesResumable(fileRef, file);
    // uploadTask.on(
    //   "state_changed",
    //   (snapShot) => {
    //     let progress = (snapShot.bytesTransferred / snapShot.totalBytes) * 100;
    //     progress = Math.trunc(progress);
    //     console.log(progress);
    //   },
    //   (error) => {
    //     console.log("error:");
    //   },
    //   () => {
    //     setFileName(file);
    //     setUploadedFile(file);
    //     navigate("/edit");
    //   }
    // );
    setFileName(file);
    setUploadedFile(file);
    navigate("/edit");
  };
  // ^^ upload(file);

  return (
    <div className="home">
      <DropzoneArea setFile={setFile} />
      <button onClick={buttonClickHandler} disabled={!file}>
        Upload
      </button>
    </div>
  );
};

export default Home;

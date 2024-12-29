/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { useSimpleCamera } from "@/hooks/useSimpleCamera";
import { useState } from "react";

export default function Home() {
  const [imageURL, setImageURL] = useState("");
  const {
    permissionAcquired,
    acquirePermissions,
    captureImage,
    startCamera,
    stopCamera,
    stopVideoRecording,
    recordVideo,
    downloadRecordedVideo,
  } = useSimpleCamera();

  const captureImageLocal = async () => {
    setImageURL(await captureImage());
    console.log(imageURL);
  };

  return (
    <div className="max-w-7xl mx-auto mt-20">
      <div
        className={
          "mb-4 py-4  text-center font-semibold " +
          (permissionAcquired ? "bg-green-200" : "bg-red-200")
        }
      >
        Permissions Status: {permissionAcquired ? "TRUE" : "FALSE"}
      </div>

      <div className="grid grid-cols-2  gap-4 ">
        <div className="grid grid-cols-4 gap-4">
          <button
            onClick={(e) => acquirePermissions()}
            className="bg-gray-300 px-6 py-2"
          >
            Ask for permission
          </button>
          <button
            onClick={(e) => startCamera()}
            className="bg-gray-300 px-6 py-2"
          >
            Start Camera
          </button>
          <button
            onClick={(e) => stopCamera()}
            className="bg-gray-300 px-6 py-2"
          >
            Stop Camera
          </button>
          <button onClick={captureImageLocal} className="bg-gray-300 px-6 py-2">
            Capture Image
          </button>
          <button
            onClick={(e) => recordVideo("test1")}
            className="bg-gray-300 px-6 py-2"
          >
            Start Video Recoding
          </button>
          <button
            onClick={(e) => stopVideoRecording()}
            className="bg-gray-300 px-6 py-2"
          >
            Stop Video Recording
          </button>
          <button
            onClick={(e) => downloadRecordedVideo("test1")}
            className="bg-gray-300 px-6 py-2"
          >
            Download video
          </button>
        </div>

        {/* <video  src={mediaStream.}/> */}

        {imageURL && (
          <img
            src={imageURL}
            alt=""
            className="min-h-52 min-w-full bg-gray-50"
          />
        )}
      </div>
    </div>
  );
}

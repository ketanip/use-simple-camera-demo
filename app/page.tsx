"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { useSimpleCamera } from "use-simple-camera";
import { useRef, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import Link from "next/link";

export default function Home() {
  const [imageURL, setImageURL] = useState("");
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLVideoElement>(null);
  const [videoRecodingID, setVideoRecordingID] = useState<string>("");
  const [videoSourceID, setVideoSourceID] = useState("");
  const [audiosSourceID, setAudioSourceID] = useState("");

  const {
    acquirePermissions,
    audioDevicesIDs,
    captureImage,
    downloadRecordedVideo,
    isCameraActive,
    permissionAcquired,
    recordVideo,
    startCamera,
    stopCamera,
    stopVideoRecording,
    videoDevicesIDs,
    videoRecodingInProgress,
    getMediaStream,
  } = useSimpleCamera();

  const captureImageLocal = async () => {
    try {
      setImageURL(await captureImage(videoSourceID));
    } catch (error: any) {
      toast(error.message);
    }
  };

  const startPlayingVideo = async () => {
    try {
      const videoAndAudioSource = await getMediaStream({
        audioID: audiosSourceID,
        videoID: videoSourceID,
      });
      if (videoRef.current) {
        videoRef.current.srcObject = videoAndAudioSource;
        videoRef.current.play();
      }
    } catch (error: any) {
      toast(error.message);
    }
  };

  const stopRecodingVideo = async () => {
    try {
      await stopVideoRecording();
    } catch (error: any) {
      toast(error.message);
    }
  };

  const stopPlayingVideo = async () => {
    try {
      if (videoRef.current) videoRef.current.srcObject = null;
    } catch (error: any) {
      toast(error.message);
    }
  };

  const startPlayingAudio = async () => {
    try {
      const videoAndAudioSource = await getMediaStream({
        audioID: "default",
        videoID: "none",
      });
      if (audioRef.current) {
        audioRef.current.srcObject = videoAndAudioSource;
        audioRef.current.play();
      }
    } catch (error: any) {
      toast(error.message);
    }
  };

  const stopPlayingAudio = async () => {
    try {
      if (audioRef.current) audioRef.current.srcObject = null;
    } catch (error: any) {
      toast(error.message);
    }
  };

  function downloadVideoWithVideoID(): void {
    try {
      downloadRecordedVideo(videoRecodingID, `${videoRecodingID}.webm`);
    } catch (error: any) {
      toast(error.message);
    }
  }

  return (
    <div className="max-w-7xl mx-auto  px-4 flex flex-col gap-4 min-h-screen">
      <ToastContainer />
      {/* Title */}
      <div className="min-w-full bg-yellow-300 px-4 font-mono font-semibold text-xl text-center py-4 mb-4 border-2 border-black shadow-md">
        <h3>Use-Simple-Camera Hook Demo</h3>
      </div>

      <div className="text-center bg-gray-50 py-2 md:hidden"> 
        Use larger screens for better experience.
      </div>

      <div className="flex-1">
        <div className="grid md:grid-cols-4 gap-2">
          <div
            className={
              "mb-4 py-4  text-center font-semibold rounded shadow-md  " +
              (permissionAcquired ? "bg-green-200" : "bg-red-200")
            }
          >
            Permissions Acquired: {permissionAcquired ? "TRUE" : "FALSE"}
          </div>

          <div
            className={
              "mb-4 py-4  text-center font-semibold rounded shadow-md  " +
              (isCameraActive ? "bg-green-200" : "bg-red-200")
            }
          >
            Camera Active: {isCameraActive ? "TRUE" : "FALSE"}
          </div>

          <div
            className={
              "mb-4 py-4  text-center font-semibold bg-violet-200 rounded shadow-md  "
            }
          >
            Video Recoding ID :{" "}
            {videoRecodingID ? videoRecodingID : "NO VIDEO RECORDING ID"}
          </div>

          <div
            className={
              "mb-4 py-4  text-center font-semibold bg-violet-200 rounded shadow-md  "
            }
          >
            Video Recoding :{" "}
            {videoRecodingInProgress ? "TRUE" : "NO VIDEO RECORDING NOW"}
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4 my-4">
          <div className="flex flex-col">
            <label className="font-semibold">Select Camera ID</label>
            <select
              name="active_video_id"
              id="active_video_id"
              className="p-2 rounded"
              onChange={(e) => setVideoSourceID(e.target.value)}
              defaultValue="default"
            >
              <option disabled value="default">
                Select your camera
              </option>
              {videoDevicesIDs.map((item) => (
                <option value={item.id} key={item.id}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col">
            <label className="font-semibold">Select Audio Device ID</label>
            <select
              name="active_audio_id"
              id="active_audio_id"
              className="p-2 rounded"
              onChange={(e) => setAudioSourceID(e.target.value)}
              defaultValue="default"
            >
              <option disabled value="default">
                Select your audio input
              </option>

              {audioDevicesIDs.map((item) => (
                <option value={item.id} key={item.id}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col">
            <label className="font-semibold">Enter Video ID</label>
            <input
              type="text"
              name="video_id"
              id="video_id"
              className="p-2 rounded border"
              onChange={(e) => setVideoRecordingID(e.target.value)}
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2  gap-4 ">
          <div className="grid md:grid-cols-4 gap-4">
            <button
              onClick={() => acquirePermissions()}
              className="bg-gray-300 px-6 py-2"
            >
              Ask for permission
            </button>
            <button
              onClick={() => startCamera()}
              className="bg-gray-300 px-6 py-2"
            >
              Start Camera
            </button>
            <button
              onClick={() => stopCamera()}
              className="bg-gray-300 px-6 py-2"
            >
              Stop Camera
            </button>
            <button
              onClick={captureImageLocal}
              className="bg-gray-300 px-6 py-2"
            >
              Capture Image
            </button>
            <button
              onClick={() =>
                recordVideo(videoRecodingID).catch((err) => toast(err.message))
              }
              className="bg-gray-300 px-6 py-2"
            >
              Start Video Recoding
            </button>
            <button
              onClick={stopRecodingVideo}
              className="bg-gray-300 px-6 py-2"
            >
              Stop Video Recording
            </button>
            <button
              onClick={downloadVideoWithVideoID}
              className="bg-gray-300 px-6 py-2"
            >
              Download video
            </button>
            <button
              onClick={() => startPlayingVideo()}
              className="bg-gray-300 px-6 py-2"
            >
              Start Video Feed
            </button>

            <button
              onClick={() => stopPlayingVideo()}
              className="bg-gray-300 px-6 py-2"
            >
              Stop Video Feed
            </button>

            <button
              onClick={() => startPlayingAudio()}
              className="bg-gray-300 px-6 py-2"
            >
              Start Audio Feed
            </button>

            <button
              onClick={() => stopPlayingAudio()}
              className="bg-gray-300 px-6 py-2"
            >
              Stop Audio Feed
            </button>
          </div>

          {imageURL && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={imageURL}
              alt=""
              className="min-h-52 min-w-full bg-gray-50"
            />
          )}

          {videoRef && <video ref={videoRef} controls />}
          {audioRef && <audio ref={audioRef} controls />}
        </div>
      </div>

      <div className="bg-gray-50 text-center min-w-full py-4 ">
        Find it on{" "}
        <Link href="https://github.com/ketanip/use-simple-camera" className="font-semibold underline text-blue-400 hover:cursor-pointer hover:text-blue-500">Github</Link>{" "}
        and{" "}
        <Link href="https://www.npmjs.com/package/use-simple-camera" className="font-semibold underline text-blue-400 hover:cursor-pointer hover:text-blue-500">
          npmjs
        </Link>
        .
      </div>
    </div>
  );
}

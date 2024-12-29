/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";

export const useSimpleCamera = () => {
  const [permissionAcquired, setPermissionAcquired] = useState<boolean>(false);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const [videoDevicesID, setVideoDevicesID] = useState<string[]>([]);
  const [audioDevicesID, setAudioDevicesID] = useState<string[]>([]);
  const [videos, setVideos] = useState<{ id: string; data: Blob }[]>([]);
  const [activeMediaRecorder, setActiveMediaRecorder] =
    useState<MediaRecorder | null>(null);
  const [currentVideoRecordingID, setCurrentVideoRecordingID] = useState<
    string | null
  >(null);

  useEffect(() => {
    checkPermissions();
  }, []);

  const checkPermissions = async () => {
    const permissions: any[] = ["camera", "microphone"];
    const results = permissions.map(
      async (item) =>
        (await navigator.permissions.query({ name: item })).state === "granted"
    );
    const values = await Promise.all(results);
    if (!values.includes(false)) {
      setPermissionAcquired(true);
      return;
    }
  };

  const acquirePermissions = async () => {
    try {
      checkPermissions();
      if (permissionAcquired) return;

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      mediaStream.getTracks().forEach((track) => {
        track.stop();
      });
      setPermissionAcquired(true);
    } catch (error: any) {
      setPermissionAcquired(false);
      throw new Error("Failed to get required permissions.");
    }
  };

  const startCamera = async (config?: MediaStreamConstraints) => {
    try {
      // Checking if permissions are granted.
      if (!acquirePermissions)
        throw new Error("Failed to acquire permission for media device usage.");

      // Setting up flexible media stream constraints.
      const mediaStreamConstraints: MediaStreamConstraints = config
        ? config
        : {
            video: true,
            audio: true,
          };

      // Getting media stream.
      const mediaStream = await navigator.mediaDevices.getUserMedia(
        mediaStreamConstraints
      );

      // Saving video and audio devices.
      setVideoDevicesID(mediaStream.getVideoTracks().map((item) => item.id));
      setAudioDevicesID(mediaStream.getAudioTracks().map((item) => item.id));

      // Setting up media stream.
      setMediaStream(mediaStream);

      setIsActive(true);
    } catch (error: any) {
      if (error.name == "NotAllowedError") {
        setPermissionAcquired(false);
        throw new Error("Failed to acquire permission for media device usage.");
      }
      throw error;
    }
  };

  const stopCamera = async () => {
    mediaStream?.getTracks().forEach((item) => item.stop());
    setAudioDevicesID([]);
    setVideoDevicesID([]);
    setIsActive(false);
  };

  const captureImage = async (videoID?: string): Promise<string> => {
    // Checking permissions.
    if (!permissionAcquired) {
      setPermissionAcquired(false);
      throw new Error("Failed to acquire permission for media device usage.");
    }

    // Checking media streams.
    if (!mediaStream) throw new Error("Camera not active, start camera.");

    // Getting the appropriate video stream track.
    const videoStreamTrack = videoID
      ? mediaStream.getTracks().find((item) => item.id === videoID)
      : mediaStream.getVideoTracks()[0];

    // Checking for video stream track.
    if (!videoStreamTrack) throw new Error("No video track available.");

    // Create a canvas for capturing images.
    const videoElement = document.createElement("video");
    videoElement.srcObject = new MediaStream([videoStreamTrack]);

    // Wait for the video to load its metadata and start playing video.
    await new Promise<void>((resolve, reject) => {
      videoElement.onloadedmetadata = () => {
        videoElement.play().then(resolve).catch(reject);
      };
    });

    // Create a canvas with the correct dimensions.
    const canvas = document.createElement("canvas");
    canvas.width = videoElement.videoWidth;
    canvas.height = videoElement.videoHeight;
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Failed to create canvas context.");

    // Draw the current frame onto the canvas.
    context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

    // Convert the canvas content to a data URL.
    const imageURL = canvas.toDataURL("image/png");

    // Clean up resources.
    videoElement.pause();
    if (videoElement.srcObject) videoElement.srcObject = null;
    canvas.remove();
    videoElement.remove();

    return imageURL;
  };

  interface RecordVideoConfig {
    videoStreamID: string;
    audioStreamID: string;
  }

  let videoBlobsRecorded: Blob[] = [];

  const recordVideo = async (id: string, config?: RecordVideoConfig) => {
    if (currentVideoRecordingID)
      throw new Error("Video recording is already in progress.");

    if (!mediaStream) throw new Error("Media stream is not available.");

    let customMediaStream: MediaStream = mediaStream;

    if (config) {
      const customVideoStreamTrack = mediaStream.getTrackById(
        config.videoStreamID
      );
      const customAudioStreamTrack = mediaStream.getTrackById(
        config.audioStreamID
      );
      if (customVideoStreamTrack && customAudioStreamTrack) {
        customMediaStream = new MediaStream([
          customVideoStreamTrack,
          customAudioStreamTrack,
        ]);
      }
    }

    const mediaRecorder = new MediaRecorder(customMediaStream, {
      mimeType: "video/webm",
    });

    setActiveMediaRecorder(mediaRecorder);

    videoBlobsRecorded = [];
    mediaRecorder.addEventListener("dataavailable", (e) =>
      videoBlobsRecorded.push(e.data)
    );

    mediaRecorder.addEventListener("stop", (e) => {
      setVideos([
        ...videos,
        {
          id,
          data: new Blob(videoBlobsRecorded, { type: "video/webm" }),
        },
      ]);
    });

    mediaRecorder.start(1000);
  };

  const stopVideoRecording = async () => {
    if (currentVideoRecordingID || !activeMediaRecorder)
      throw new Error("Video recording is not in progress.");

    activeMediaRecorder.stop();
    setCurrentVideoRecordingID(null);
    setActiveMediaRecorder(null);
  };

  const getRecordedVideoURL = async (videoID: string) => {
    const existingVideo = videos.filter((item) => item.id === videoID);
    if (existingVideo.length == 0)
      throw new Error(`No video with ${videoID} exists.`);

    return URL.createObjectURL(existingVideo[0].data);
  };

  const downloadRecordedVideo = async (videoID: string, filename?: string) => {
    const existingVideo = videos.filter((item) => item.id === videoID);
    if (existingVideo.length == 0)
      throw new Error(`No video with ${videoID} exists.`);

    const tempDownload = document.createElement("a");
    tempDownload.href = URL.createObjectURL(existingVideo[0].data);
    tempDownload.download = `${filename ? filename : videoID}.webm`;
    tempDownload.click();
  };

  interface GetVideoStreamConfig {
    videoID?: string | "none";
    audioID?: string | "none";
  }
  const getVideoStream = async (config: GetVideoStreamConfig) => {
    if (!mediaStream) throw new Error("Failed to initialize media stream.");

    const tracks: MediaStreamTrack[] = [];

    if (config.videoID && config.videoID != "none") {
      const customVideoTrack = mediaStream.getTrackById(config.videoID);
      if (!customVideoTrack) throw new Error("Invalid video source ID.");
      tracks.push(customVideoTrack);
    } else if (config.videoID != "none") {
      const videoTracks = mediaStream.getVideoTracks();
      if (videoTracks.length > 0) tracks.push(videoTracks[0]);
    }

    if (config.audioID && config.videoID != "none") {
      const customAudioTrack = mediaStream.getTrackById(config.audioID);
      if (!customAudioTrack) throw new Error("Invalid video source ID.");
      tracks.push(customAudioTrack);
    } else if (config.videoID != "none") {
      const audioTracks = mediaStream.getAudioTracks();
      if (audioTracks.length > 0) tracks.push(audioTracks[0]);
    }

    return new MediaStream(tracks);
  };

  return {
    // States
    permissionAcquired,
    isActive,
    videoDevicesID,
    audioDevicesID,

    // Actions
    acquirePermissions,
    startCamera,
    stopCamera,
    captureImage,
    recordVideo,
    stopVideoRecording,
    getRecordedVideoURL,
    downloadRecordedVideo,
    getVideoStream,
  };
};

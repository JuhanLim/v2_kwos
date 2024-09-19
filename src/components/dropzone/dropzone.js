// import React, {useCallback} from 'react'
// import {useDropzone} from 'react-dropzone'
// import styled from 'styled-components';
// import axios from 'axios';

// const MyDropzone= () => {
//     const onDrop = useCallback(async (acceptedFiles) => {
        
//         const formData = new FormData();
//         const config = {
//           // header: {
//           //   "content-type": "multipart/form-data",
//           //},
//         };
//         formData.append("file", acceptedFiles[0]);
//         console.log(acceptedFiles[0]);
    
//         // 배포시에는 지워줘야 합니다.
//         axios.defaults.baseURL = "http://175.45.204.163:3000/";
//           await axios.post("/predict", formData, config)
//           .then((res) => {
//             console.log(res);
//           })
//           .catch((err) => {
//             console.error("Error uploading file:", err.response || err);
//           });
//         }, []);
    
//       const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });
    
//       const InputProps = {
//         ...getInputProps(),
//         multiple: false,
//         accept: "image/gif, image/jpg, image/jpeg, image/png",
//       };
    
//       const RootProps = {
//         ...getRootProps(),
//       };
    
//       return (
//         <DropZone {...RootProps} maxSize={100} multiple={false}>
//           <input {...InputProps} />
//           {isDragActive ? (
//             <p>이제 이미지를 놓아주세요</p>
//           ) : (
//             <div
//               style={{
//                 display: "flex",
//                 flexDirection: "column",
//                 alignItems: "center",
//               }}
//             >
//               <div style={{ fontSize: "3em", marginBottom: "5px" }}>
//                 <i className="fas fa-file-upload"></i>
//               </div>
//               <div>이미지 드랍 or 클릭</div>
//             </div>
//           )}
//         </DropZone>
//       );
// }

// export default MyDropzone;

// const DropZone = styled.div``;



// import React, { useCallback, useState } from 'react';
// import { useDropzone } from 'react-dropzone';
// import axios from 'axios';
// import styled from 'styled-components';

// const MyDropzone = () => {
//   const [videoFile, setVideoFile] = useState(null);  // 비디오 파일 상태
//   const [srtFile, setSrtFile] = useState(null);      // SRT 파일 상태
//   const [errorMessage, setErrorMessage] = useState(''); // 오류 메시지 상태
//   const [isUploading, setIsUploading] = useState(false); // 업로드 상태

//   const onDrop = useCallback((acceptedFiles) => {
//     setErrorMessage(''); // 매번 초기화
    
//     let hasMp4 = false;
//     let hasSrt = false;
  
//     acceptedFiles.forEach((file) => {
//       if (file.type === 'video/mp4') {
//         setVideoFile(file);
//         hasMp4 = true;
//       } else if (file.type === 'text/plain') {
//         setSrtFile(file);
//         hasSrt = true;
//       }
//     });
  
//     // 둘 다 없을 때만 오류 메시지를 표시
//     if (!hasMp4 || !hasSrt) {
//       setErrorMessage('Please upload both a .mp4 video and a .srt file.');
//     }
//   }, []);

//   const onUpload = async () => {
//     // 파일이 없을 때 오류 처리
//     if (!videoFile || !srtFile) {
//       setErrorMessage('Please upload both a video and an SRT file.');
//       return;
//     }

//     // 파일 업로드 준비
//     const formData = new FormData();
//     formData.append('video', videoFile);
//     formData.append('srt', srtFile);

//     try {
//       setIsUploading(true);
//       // 파일 전송
//       const response = await axios.post('http://0.0.0.0:3000/predict', formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//         responseType: 'blob',  // ZIP 파일을 기대하므로 Blob 타입으로 설정
//       });

//       // 응답이 성공적일 경우 ZIP 파일 다운로드
//       if (response.status === 200) {
//         const url = window.URL.createObjectURL(new Blob([response.data]));
//         const link = document.createElement('a');
//         link.href = url;
//         link.setAttribute('download', 'output.zip'); // 다운로드할 파일 이름 설정
//         document.body.appendChild(link);
//         link.click();
//         document.body.removeChild(link);
//         setErrorMessage('');
//       } else {
//         setErrorMessage(`Upload failed with status code: ${response.status}`);
//       }
//     } catch (error) {
//       console.error('Error uploading files:', error);
//       setErrorMessage('An error occurred during upload.');
//     } finally {
//       setIsUploading(false);
//     }
//   };

//   // Dropzone 설정
//   const { getRootProps, getInputProps, isDragActive } = useDropzone({
//     onDrop,
//     accept: 'video/mp4, text/plain', // .mp4와 .srt 파일만 허용
//   });

//   return (
//     <div>
//       <DropZone {...getRootProps()}>
//         <input {...getInputProps()} />
//         {isDragActive ? (
//           <p>Drop the video and SRT files here ...</p>
//         ) : (
//           <p>Drag and drop a video (.mp4) and an SRT file (.srt) here, or click to select files</p>
//         )}
//       </DropZone>
//       <button onClick={onUpload} disabled={isUploading}>
//         {isUploading ? 'Uploading...' : 'Upload'}
//       </button>
//       {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
//     </div>
//   );
// };

// export default MyDropzone;

// const DropZone = styled.div`
//   border: 2px dashed #cccccc;
//   padding: 20px;
//   text-align: center;
//   cursor: pointer;
//   background-color: #f9f9f9;
//   margin-bottom: 20px;
// `;


import 'react-dropzone-uploader/dist/styles.css'
import Dropzone from 'react-dropzone-uploader'
import axios from 'axios';
import { useState } from 'react';

const MyDropzone = () => {
  const [errorMessage, setErrorMessage] = useState('');
  
  // Upload parameters for each file
  const getUploadParams = ({ meta }) => {
    return { url: 'http://175.45.204.163:3000/predict' }; // This is where the files will be sent
  };

  // Handle file status changes
  const handleChangeStatus = ({ meta, file }, status) => {
    console.log(status, meta, file);
  };

  // Handle the submission of files
  const handleSubmit = async (files) => {
    if (files.length !== 2) {
      setErrorMessage('Please upload both a .mp4 video and a .srt file.');
      return;
    }

    const formData = new FormData();
    files.forEach(({ file }) => {
      if (file.type === 'video/mp4') {
        formData.append('video', file); // Append video file
      } else if (file.type === 'text/plain') {
        formData.append('srt', file); // Append SRT file
      }
    });

    // Ensure both files were added
    if (!formData.has('video') || !formData.has('srt')) {
      setErrorMessage('Please upload both a .mp4 video and a .srt file.');
      return;
    }

    try {
      const response = await fetch('http://175.45.204.163:3000/predict', {
        method: 'POST',
        body: formData,
        mode: 'cors', // CORS 모드 설정
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      if (response.status === 200) {
        // Handle downloading the ZIP file
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'output.zip');
        document.body.appendChild(link);
        link.click();
        link.remove();
      } else {
        setErrorMessage(`Upload failed with status code: ${response.status}`);
      }
    } catch (error) {
      console.error('Error uploading files:', error);
      setErrorMessage('An error occurred during upload.');
    }
  };

  return (
    <div>
     <Dropzone
        getUploadParams={getUploadParams}
        onChangeStatus={handleChangeStatus}
        onSubmit={handleSubmit}
        accept="video/mp4, text/plain, .srt"  // .srt 확장자 명시
        inputContent="Drop a .mp4 video and a .srt file"
        submitButtonContent="Upload Files"
      />
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
    </div>
  );
};

export default MyDropzone;

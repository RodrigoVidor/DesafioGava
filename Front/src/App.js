import { useState, useRef } from "react";
import "./App.css";

function App() {
  const [text, setText] = useState("");
  let [isRecording, setRecord] = useState(false);
  let [isLoadingTransc, setLoadTrans] = useState(false);
  const mediaRecorderRef = useRef(null);

  const handleRecord = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    const audioChunks = [];

    if (isRecording) {
      mediaRecorderRef.current.stop();
    } else {
      mediaRecorder.start();
      setTimeout(() => mediaRecorder.stop(), 10000);
      mediaRecorderRef.current = mediaRecorder;
    }

    isRecording = setRecord(!isRecording);

    mediaRecorderRef.current.ondataavailable = (e) => {
      if (e.data.size > 0) audioChunks.push(e.data);
    };

    mediaRecorderRef.current.onstop = async () => {
      setLoadTrans(true);
      const audioBlob = new Blob(audioChunks, { type: "audio/webm" });
      const formData = new FormData();
      formData.append("file", audioBlob, "audio.webm");

      const response = await fetch(
        "https://localhost:5001/api/mic/transcrever",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();
      setText(data.text || "Erro ao transcrever");
      setLoadTrans(false);
    };
  };

  return (
    <div className="Title-header">
      <div className="Base">
        {isLoadingTransc ? (
          <>Loading</>
        ) : (
          <>
            <h1 className="Title">Transcrição de Voz</h1>
            <button className="Botao" onClick={handleRecord}>
              {isRecording ? "Parar" : "Gravar"}
            </button>
            <p className="transcricao">Transcrição: {text}</p>
          </>
        )}
      </div>
    </div>
  );
}

export default App;

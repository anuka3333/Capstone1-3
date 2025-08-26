import React, { useState } from "react";
import { supabase } from "../supabaseClient";

const AlbumForm = ({ clients }) => {
  const [selectedClient, setSelectedClient] = useState("");
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploadedUrls, setUploadedUrls] = useState([]);

  const handleClientChange = (e) => {
    setSelectedClient(e.target.value);
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);
    const previewUrls = selectedFiles.map((file) =>
      URL.createObjectURL(file)
    );
    setPreviews(previewUrls);
  };

  const handleUpload = async () => {
    if (!selectedClient) {
      alert("Please select a client before uploading.");
      return;
    }
    if (files.length === 0) {
      alert("Please select files to upload.");
      return;
    }
    setLoading(true);
    try {
      const uploaded = [];
      for (const file of files) {
        const fileExt = file.name.split(".").pop();
        const fileName = `${selectedClient}/${Date.now()}-${Math.random()
          .toString(36)
          .substring(2)}.${fileExt}`;
        const { data, error } = await supabase.storage
          .from("portfolio-photos")
          .upload(fileName, file);
        if (error) {
          console.error("Error uploading file:", error);
          continue;
        }
        const { publicURL, error: urlError } = supabase.storage
          .from("portfolio-photos")
          .getPublicUrl(fileName);
        if (urlError) {
          console.error("Error getting public URL:", urlError);
          continue;
        }
        uploaded.push(publicURL);
      }
      setUploadedUrls(uploaded);
      setFiles([]);
      setPreviews([]);
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Upload Portfolio Photos</h2>
      <label>
        Select Client:
        <select value={selectedClient} onChange={handleClientChange}>
          <option value="">-- Select Client --</option>
          {clients.map((client) => (
            <option key={client.id} value={client.id}>
              {client.name}
            </option>
          ))}
        </select>
      </label>
      <br />
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={handleFileChange}
      />
      <br />
      {previews.length > 0 && (
        <div>
          <h3>Previews:</h3>
          {previews.map((src, idx) => (
            <img
              key={idx}
              src={src}
              alt={`preview-${idx}`}
              style={{ width: 100, marginRight: 10 }}
            />
          ))}
        </div>
      )}
      <button onClick={handleUpload} disabled={loading}>
        {loading ? "Uploading..." : "Upload"}
      </button>
      {uploadedUrls.length > 0 && (
        <div>
          <h3>Uploaded Photos:</h3>
          {uploadedUrls.map((url, idx) => (
            <img
              key={idx}
              src={url}
              alt={`uploaded-${idx}`}
              style={{ width: 100, marginRight: 10 }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default AlbumForm;

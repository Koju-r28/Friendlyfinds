import React, { useState } from "react";

const MultipleImageUpload = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setSelectedFiles(e.target.files);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedFiles || selectedFiles.length === 0) {
      alert("Please select images to upload");
      return;
    }

    const formData = new FormData();
    for (let i = 0; i < selectedFiles.length; i++) {
      formData.append("images", selectedFiles[i]); // Must match Multer field name
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/upload-items", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      setUploadedImages(data.files); // Store uploaded file paths
      setLoading(false);
      setSelectedFiles([]); // Clear selected files
    } catch (err) {
      console.error(err);
      alert("Upload failed!");
      setLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleUpload} encType="multipart/form-data">
        <label>Select images for your item (multiple allowed):</label>
        <input
          type="file"
          name="images"
          multiple
          accept="image/*"
          onChange={handleFileChange}
        />
        <button type="submit" disabled={loading}>
          {loading ? "Uploading..." : "Upload"}
        </button>
      </form>

      {uploadedImages.length > 0 && (
        <div style={{ marginTop: "20px" }}>
          <h4>Uploaded Images:</h4>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
            {uploadedImages.map((file, idx) => (
              <img
                key={idx}
                src={`http://localhost:5000${file}`} // prepend backend URL
                alt="uploaded"
                width={150}
                style={{ border: "1px solid #ccc", padding: "2px" }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MultipleImageUpload;

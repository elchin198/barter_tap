import React, { useState } from "react";

const UploadImage = () => {
  const [imageUrl, setImageUrl] = useState("");

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      console.log("Şəkil URL:", data.url);
      setImageUrl(data.url);
    } catch (err) {
      console.error("Şəkil yüklənərkən xəta:", err);
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      {imageUrl && (
        <div style={{ marginTop: "10px" }}>
          <img src={imageUrl} alt="Yüklənmiş şəkil" width={200} />
        </div>
      )}
    </div>
  );
};

export default UploadImage;

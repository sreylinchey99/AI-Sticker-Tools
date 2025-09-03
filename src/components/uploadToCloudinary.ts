export async function uploadToCloudinary(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "unsigned_preset");

  const response = await fetch(
    "https://api.cloudinary.com/v1_1/dted3oqxk/image/upload",
    { method: "POST", body: formData }
  );

  const data = await response.json();
  if (data.secure_url) {
    return data.secure_url;
  } else {
    throw new Error("Image upload failed: " + JSON.stringify(data));
  }
}

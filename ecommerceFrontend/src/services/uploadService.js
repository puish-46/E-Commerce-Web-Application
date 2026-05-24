import api from "./api";

/*
============================
UPLOAD IMAGE
============================
*/
export const uploadImageAPI = async (imageFile) => {
  const formData = new FormData();
  formData.append("image", imageFile);

  // We only need to override Content-Type since Authorization is handled by interceptor
  const response = await api.post("/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};
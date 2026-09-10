import api from "./axios.js";


export const generateDescription = (name, type) =>
    api.post("/ai/generate-description", { name, type });

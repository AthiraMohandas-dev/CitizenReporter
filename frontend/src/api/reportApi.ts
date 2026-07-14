import axios from "axios";

const api = axios.create({
  baseURL: "http://192.168.2.39:3000",
  timeout: 30000,
});

export async function generateEmail(issue: string, category: string) {
  const response = await api.post("/api/report/generate", {
    issue,
    category,
  });

  return response.data;
}

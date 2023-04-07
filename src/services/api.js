import axios from "axios";

const baseAPI = axios.create({
    baseURL: process.env.REACT_APP_CODELEAP_API_URL
});

async function getPosts(limit, pageNumber) {
    return await baseAPI.get(`/?limit=${limit}&offset=${(pageNumber - 1) * limit}`);
}

async function createPost(data) {
    await baseAPI.post("/", data);
}

async function deletePost(id) {
    await baseAPI.delete(`/${id}/`);
}

async function editPost(data) {
    await baseAPI.patch(`/${data.id}/`, { title: data.title, content: data.content });
}

const api = {
    getPosts,
    createPost,
    deletePost,
    editPost
}

export default api;
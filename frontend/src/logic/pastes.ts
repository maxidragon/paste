import {backendRequest} from "./request.ts";

export interface Paste {
    id: string;
    url: string;
    title: string;
    content: string;
    created_at: string;
    updated_at: string;
}

export const getPaste = async (id: string) => {
    const response = await backendRequest(`paste/${id}`, "GET");
    const json = await response.json();
    return json.data
};

interface CreatePasteData {
    url?: string;
    title: string;
    content: string;
}

export const createPaste = async (data: CreatePasteData) => {
    const response = await backendRequest("paste", "POST", data);
    const json = await response.json();
    return {
        status: response.status,
        data: json.data
    }
};
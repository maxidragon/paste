import {FormEvent} from "react";
import toast from "react-hot-toast";
import {useNavigate} from "react-router-dom";
import {createPaste} from "../logic/pastes.ts";

const CreatePaste = () => {
    const navigate = useNavigate();

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data= new FormData(event.currentTarget);
        const title = data.get("title");
        const url = data.get("url");
        const content = data.get("content");
        if (!title || !content) {
            return toast.error("Please fill in all fields");
        }
        const response = await createPaste({
            url: url?.toString() || undefined,
            title: title.toString(),
            content: content.toString(),
        });

        if (response.status === 200) {
            toast.success("Paste created successfully");
            navigate(response.data.url);
        } else if (response.status === 409) {
            toast.error("A paste with this URL already exists");
        } else {
            toast.error("Something went wrong");
        }
    };

    return (
        <div className="flex flex-col items-center bg-gray-800 text-white h-screen gap-5">
            <h1 className="text-4xl font-bold mt-10">Create a new paste</h1>
            <form onSubmit={handleSubmit} className="flex flex-col gap-5 items-center w-full h-full">
                <input className="p-2 rounded-md bg-transparent border border-white" placeholder="Title"
                       name="title" />
                <input className="p-2 rounded-md bg-transparent border border-white" placeholder="URL" name="url"/>
                <textarea className="rounded-md bg-transparent border border-white w-1/2 h-1/2 p-2"
                          placeholder="Content" name="content"/>
                <button className="bg-green-700 p-2 rounded-md" type="submit">Create</button>
            </form>

        </div>
    )
};

export default CreatePaste;
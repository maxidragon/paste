import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {getPaste, Paste} from "../logic/pastes.ts";

const ViewPaste = () => {
    const {id} = useParams<{ id: string }>();
    const [paste, setPaste] = useState<Paste | null>(null);

    useEffect(() => {
        if (!id) return;
        getPaste(id).then((data) => {
            setPaste(data);
        });
    }, [id]);

    if (!paste) {
        return <div>Loading...</div>
    }

    return (
        <div className="flex flex-col items-center bg-gray-800 text-white h-screen gap-5">
            <h1 className="text-4xl font-bold mt-10">{paste.title}</h1>
            <p className="text-gray-400">Created at: {new Date(paste.created_at).toLocaleString()}</p>
            <button className="bg-green-700 p-2 rounded-md" onClick={() => navigator.clipboard.writeText(paste.content)}>Copy</button>
            <textarea readOnly={true} className="p-2 rounded-md bg-transparent border border-white w-1/2 h-1/2" value={paste.content}/>
        </div>
    );
};

export default ViewPaste;
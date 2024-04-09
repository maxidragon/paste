import {Toaster} from "react-hot-toast";
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import CreatePaste from "./Pages/CreatePaste.tsx";
import ViewPaste from "./Pages/ViewPaste.tsx";

const App = () => {
    const router = createBrowserRouter([
        {
            path: "/",
            element: <CreatePaste/>,
        },
        {
            path: "/:id",
            element: <ViewPaste/>,
        }
    ])

    return (
        <>
            <Toaster/>
            <RouterProvider router={router}/>
        </>
    )
}

export default App

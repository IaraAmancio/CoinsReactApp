import {createBrowserRouter} from 'react-router-dom'
import { Home } from "./pages/home"
import { Details } from "./pages/detail"
import { NotFound } from "./pages/notfound"
import {Layout} from "./components/layout/layout"

const router = createBrowserRouter([
    {
        element: <Layout/>,
        children: [
            {
                path: '/',
                element: <Home/>
            },
            {
                path: '/detail/:cript',
                element: <Details/>
            },
            {
                path: '*',
                element: <NotFound/>
            }
        ]
    }
])
export {router}
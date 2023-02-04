import { Navigate, RouteObject } from "react-router-dom";
import { lazy } from "react";

const ListPage = lazy(() => import('./ListPage/ListPage'));
const CreateListPage = lazy(() => import('./CreateListPage/CreateListPage'));

export const routes: RouteObject[] = [
    {
        path: '',
        element: <Navigate to={'/list/new'}/>,
    },
    {
        path: ':id',
        element: <ListPage />,
    },
    {
        path: 'new',
        element: <CreateListPage />,
    },
] 
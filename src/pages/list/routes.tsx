import { Navigate, RouteObject } from "react-router-dom";
import { lazy } from "react";

const ListPage = lazy(() => import('./ListPage/ListPage'));
const AddReviewPage = lazy(() => import('./AddReviewPage/SearchFilmPage'));

export const routes: RouteObject[] = [
    {
        path: '',
        element: <Navigate to={'/welcome'}/>,
    },
    {
        path: ':id',
        element: <ListPage />,
    },
    {
        path: ':id/add',
        element: <AddReviewPage />,
    },
] 
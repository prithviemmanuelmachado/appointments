import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

/**
 * ProtectedRoute - A higher-order component to protect routes based on user authentication and role.
 * 
 * This component uses React-Redux to determine if a user is logged in or has admin access.
 * It renders child routes if the conditions are met or redirects to the home page (`/`) otherwise.
 *
 * @component
 *
 * @param {Object} props - Properties passed to the ProtectedRoute component.
 * @param {boolean} [props.isAdminOnly=false] - If true, restricts access to users with admin privileges (`profile.isStaff` must be true).
 * @param {boolean} [props.isLoginRequired=true] - If true, restricts access to logged-in users (`profile.email` must not be null).
 * 
 * @example
 * // Protecting a route that requires login:
 * <Route element={<ProtectedRoute />}>
 *   <Route path="/dashboard" element={<Dashboard />} />
 * </Route>
 * 
 * @example
 * // Protecting a route that requires admin access:
 * <Route element={<ProtectedRoute isAdminOnly={true} />}>
 *   <Route path="/admin" element={<AdminPanel />} />
 * </Route>
 * 
 * @example
 * // Allowing access without login:
 * <Route element={<ProtectedRoute isLoginRequired={false} />}>
 *   <Route path="/public" element={<PublicPage />} />
 * </Route>
 *
 * @returns {JSX.Element} A React Router `Outlet` for rendering child routes if conditions are met, else a `Navigate` component
 */
export default function ProtectedRoute(props) {
    const {
        isAdminOnly = false,
        isLoginRequired = true,
    } = props;

    const profile = useSelector(state => state.profile);

    if(
        (isLoginRequired && profile.email === null) ||
        (isAdminOnly && profile.isStaff === false)
    ){
        return <Navigate to="/" replace/>
    }

    return(
        <Outlet/>
    );
}
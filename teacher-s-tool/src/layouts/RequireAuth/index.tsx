import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { RootState } from '../../store/store';


export default function RequireAuth ({ children }: {children: React.ReactNode}) {
	const currentUser = useSelector((s: RootState) => s.user.jwt);
	if(!currentUser) {
		return <Navigate to="/signIn" replace/>;
	} else {
		return children;
	}
};
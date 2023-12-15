import { Navigate } from "react-router-dom";
import { auth } from "../firebase";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = auth.currentUser;
  console.log(user);
  if (user === null) {
    //user가 null이라면 로그인하지 않은 사용자니까 로그인 페이지로 이동
    return <Navigate to="/login" />;
  }
  return children;
}

import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";

import { googleOauthClientId } from "src/lib/constants";
import { signInWithGoogle } from "src/redux/auth";
import { useAppDispatch } from "src/redux/hooks";

export function SignInWithGoogle() {
  const dispatch = useAppDispatch();

  return (
    <GoogleOAuthProvider clientId={googleOauthClientId}>
      <GoogleLogin
        onSuccess={(response) => {
          const token = response.credential;
          if (!token) {
            console.error("No Google token.");
            return;
          }
          dispatch(signInWithGoogle({ token }));
        }}
        onError={() => console.error("Signin with google failed.")}
      />
    </GoogleOAuthProvider>
  );
}

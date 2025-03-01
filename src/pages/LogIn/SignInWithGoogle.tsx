import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";

import { googleOauthClientId } from "lib/constants";
import { useState } from "react";
import { signInWithGoogle } from "redux/auth";
import { useAppDispatch } from "redux/hooks";

export function SignInWithGoogle() {
  const dispatch = useAppDispatch();
  const [hasError, setHasError] = useState<boolean>(false);

  return (
    <GoogleOAuthProvider clientId={googleOauthClientId}>
      <GoogleLogin
        onSuccess={(response) => {
          const token = response.credential;
          if (!token) {
            setHasError(true);
            return;
          }
          setHasError(false);
          dispatch(signInWithGoogle({ token }));
        }}
        onError={() => setHasError(true)}
      />
      {hasError && <span>Error signing in with Google.</span>}
    </GoogleOAuthProvider>
  );
}

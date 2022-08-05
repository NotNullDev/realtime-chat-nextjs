import {
  DefaultSession,
  NextAuthOptions,
  unstable_getServerSession,
} from "next-auth";
import { getProviders } from "next-auth/react";
// @ts-ignore
import { GetServerSideProps } from "next";
import { authOptions } from "./api/auth/[...nextauth]";

export function SignIn({
  providers,
}: {
  providers: ReturnType<typeof getProviders>;
}) {
  console.log(providers);

  return (
    <div className="flex flex-1 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
      <button className="btn btn-wide">SignIn with Google</button>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  console.log(typeof context);
  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions
  );

  if (context.req.method?.toLowerCase() === "post") {
    console.log(context.req.rawHeaders);
    return {
      props: {
        providers: null,
      },
    };
  }

  if (session) {
    context.res.writeHead(302, {
      Location: "/",
    });
    context.res.end();
    return {
      props: {},
    };
  }

  const providers = await getProviders();

  const googleSignInUrl = providers?.google.signinUrl;

  return {
    props: {
      providers,
    },
  };
};

export default SignIn;

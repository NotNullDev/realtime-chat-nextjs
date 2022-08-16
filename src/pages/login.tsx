import { useState } from "react";
import { Field, Form, Formik } from "formik";
import { signIn } from "next-auth/react";

interface FormValues {
  username: string;
  password: string;
  remember: boolean;
}

export default function LogMeInPage() {
  const appName = "Chat"; // TODO

  const [showPassword, setShowPassword] = useState(false);

  const initialValues: FormValues = {
    username: "",
    password: "",
    remember: false,
  };

  return (
    <section className="flex-1 flex justify-center items-center">
      <div className="w-[800px] h-[400px] flex flex-col justify-center items-center  p-5 rounded-xl shadow-xl bg-base-100">
        {/* <h1 className="text-5xl mb-5 ">Login with your account</h1>
        <Formik
          initialValues={initialValues}
          onSubmit={(values, action) => {
            console.log(values);
          }}
        >
          <Form className="flex flex-col items-start w-[80%]">
            <Field
              type="text"
              name="username"
              placeholder="username"
              className="input input-bordered mb-3 w-full"
            />
            <Field
              type="password"
              name="password"
              placeholder="password"
              className="input input-bordered mb-3 w-full"
            />
            <div className="flex">
              <Field id="remember-me-button" type="checkbox" name="remember" />
              <label htmlFor="remember-me-button" className="ml-3">
                Remember me
              </label>
            </div>
            <button
              type="submit"
              className="btn btn-primary w-[60%] mt-3 place-self-center"
            >
              Continue
            </button>
          </Form>
        </Formik>
        <div className="mt-3">or</div> */}
        <button
        className="px-6 py-3 mt-4 font-semibold text-gray-900 bg-base-content rounded-md shadow outline-none hover:brightness-90 hover:border-blue-400 focus:outline-none"
        onClick={() => signIn("google",  {
            redirect: true,
            callbackUrl: "/",
        })}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="inline w-4 h-4 mr-3 text-gray-900 fill-current"
            viewBox="0 0 48 48"
            width="48px"
            height="48px"
          >
            <path
              fill="#fbc02d"
              d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12 s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20 s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
            ></path>
            <path
              fill="#e53935"
              d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039 l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
            ></path>
            <path
              fill="#4caf50"
              d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36 c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
              data-darkreader-inline-fill=""
            ></path>
            <path
              fill="#1565c0"
              d="M43.611,20.083L43.595,20L42,20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571 c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
            ></path>
          </svg>
          Sign in with Google
        </button>
      </div>
    </section>
  );
}

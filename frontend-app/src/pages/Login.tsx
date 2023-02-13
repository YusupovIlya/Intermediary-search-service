import { toast, ToastContentProps } from 'react-toastify';

import { useForm} from "react-hook-form";
import { ILoginRequest, ILoginResponse } from "../models";
import { useLoginMutation } from "../store/intermediarysearchservice.api";
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import history from '../hooks/history';

export default function Login() {
  const { t } = useTranslation(['user', 'toast_messages']);
  const [loginRequest] = useLoginMutation();
  const [searchParams] = useSearchParams();
  const {register, handleSubmit, formState: { errors }, reset} = useForm<ILoginRequest>({
    mode: "onBlur"
  });

  const onSubmit = async (data: ILoginRequest) => {
    try {
        reset();
        const promise =  loginRequest(data).unwrap();
        await toast.promise(
          promise,
          {
            pending: t("toastLogin.pending", {ns: 'toast_messages'}),
            success: t("toastLogin.success", {ns: 'toast_messages'})!,
            error: {
              render(response: ToastContentProps<ILoginResponse>){
                return t("toastLogin.error", {msg: response.data?.message, ns: 'toast_messages'})!
              }
            },
          }
        );
        if((await promise).token != null) {
          const returnUrl = searchParams.get("returnUrl");
          if(returnUrl != null) history.push(returnUrl);
          else history.push("/user/profile")
        }
      } catch (err) {
        console.log(err);
      }
  }


  return (
  <div className="min-h-screen flex flex-col items-center justify-start w-full">

    <div className="flex flex-col bg-white shadow-md px-4 sm:px-6 md:px-8 lg:px-10 py-8 rounded-md w-full max-w-md">
      <div className="font-medium self-center text-xl sm:text-2xl uppercase text-gray-800">{t("login.title")}</div>
      <div className="mt-10">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col mb-6">
            <label className="mb-1 text-base text-gray-600">{t("login.email")}</label>
            <div className="relative">
              <div className="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400">
                <svg className="h-6 w-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                </svg>
              </div>
              <input
                {...register("email", {
                  required: t("messages.emailRequired")!,
                  pattern: {
                    value: /\S+@\S+\.\S+/,
                    message: t("messages.emailRegex")
                  }
                })}
                className="text-sm sm:text-base placeholder-gray-500 pl-10 pr-4 rounded-lg border border-gray-400 w-full py-2 focus:outline-none focus:border-blue-400 text-gray-800" 
                placeholder="E-Mail"
                type="email"/>
            </div>
            <p className="text-red-600 inline text-base font-semibold mt-2">
                {errors?.email && errors.email.message}
            </p>
          </div>
          <div className="flex flex-col mb-6">
            <label className="mb-1 text-base text-gray-600">{t("login.password")}</label>
            <div className="relative">
              <div className="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400">
                <span>
                  <svg className="h-6 w-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </span>
              </div>
              <input
                {...register("password", {required: t("messages.passwordRequired")!})}
                className="text-sm sm:text-base placeholder-gray-500 pl-10 pr-4 rounded-lg border border-gray-400 w-full py-2 focus:outline-none focus:border-blue-400 text-gray-800" 
                placeholder="Password"
                type="password"/>
            </div>
            <p className="text-red-600 inline text-base font-semibold mt-2">
                {errors?.password && errors.password.message}
            </p>
          </div>
          <div className="flex items-center mb-6 -mt-4">
            <div className="flex ml-auto">
              <a href="#" className="inline-flex text-xs sm:text-sm text-blue-500 hover:text-blue-700">{t("login.forgotPass")}</a>
            </div>
          </div>
          <div className="flex w-full">
            <button type="submit" className="flex items-center justify-center focus:outline-none text-white text-sm sm:text-base bg-blue-600 hover:bg-blue-700 rounded py-2 w-full transition duration-150 ease-in">
              <span className="mr-2 uppercase">{t("login.login")}</span>
              <span>
                <svg className="h-6 w-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </span>
            </button>
          </div>
        </form>
      </div>
      <div className="flex justify-center items-center mt-6">
        <a href="#" target="_blank" className="inline-flex items-center font-bold text-blue-500 hover:text-blue-700 text-xs text-center">
          <span>
            <svg className="h-6 w-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </span>
          <span className="ml-2">{t("login.registration")}</span>
        </a>
      </div>
    </div>
  </div>
)
}
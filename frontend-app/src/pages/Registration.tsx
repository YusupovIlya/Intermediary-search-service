import { toast, ToastContentProps } from 'react-toastify';
import { useForm} from "react-hook-form";
import { INewUser } from "../models";
import { useRegistrationMutation } from "../store/intermediarysearchservice.api";
import { useTranslation } from 'react-i18next';
import { useState } from 'react';

export default function Registration() {
  const { t } = useTranslation(['user', 'toast_messages', 'validation_messages']);
  const [registration] = useRegistrationMutation();
  const [showForm, setShowForm] = useState(true);
  const {register, handleSubmit, formState: { errors }, reset} = useForm<INewUser>({
    mode: "onBlur"
  });

  const onSubmit = async (data: INewUser) => {
    try {
        reset();
        const promise =  registration(data).unwrap();
        await toast.promise(
          promise,
          {
            pending: t("toastRegistration.pending", {ns: 'toast_messages'}),
            success: t("toastRegistration.success", {ns: 'toast_messages'})!,
            error: {
              render(response: ToastContentProps<number>){
                if(response.data == 409) return t("toastRegistration.errorEmail", {email: data.email, ns: 'toast_messages'})
                else if(response.data == 503) return t("toastRegistration.sendingEmailError", {ns: 'toast_messages'})
                else return t("toastRegistration.error", {ns: 'toast_messages'})
              }
            },
          }
        ); //4cfda5dc-a6af-482b-8ef7-e4e5001fbbbe
        let code = (await promise).status;
        if(code == 200){
          setShowForm(false);
        }
      } catch (err) {
        console.log(err);
      }
  }


  return (
  <div className="min-h-screen flex flex-col items-center justify-start w-full">
    {!showForm &&
    <p className="mt-4 text-xl text-gray-900 dark:text-white">{t("afterReg")}</p>
    }

    {showForm &&
      <div className="flex flex-col bg-white shadow-md px-4 sm:px-6 md:px-8 lg:px-10 py-8 rounded-md w-full max-w-md">
      <div className="font-medium self-center text-xl sm:text-2xl uppercase text-gray-800">{t("registrationTitile")}</div>
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
                {...register("password", 
                {required: t("messages.passwordRequired")!,
                    pattern: {
                        value: /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{5,}$/,
                        message: t("messages.passwordValidation")
                    },
                    min: {
                        value:5,
                        message: t("messages.passwordLngth")
                    }
                })}
                className="text-sm sm:text-base placeholder-gray-500 pl-10 pr-4 rounded-lg border border-gray-400 w-full py-2 focus:outline-none focus:border-blue-400 text-gray-800" 
                placeholder="Password"
                type="password"/>
            </div>
            <p className="text-red-600 inline text-base font-semibold mt-2">
                {errors?.password && errors.password.message}
            </p>
          </div>

          <div className="flex flex-col mb-6">
            <label className="mb-1 text-base text-gray-600">{t("firstName")}</label>
              <input
                {...register("firstName", {
                  required: t("requredField", {ns: "validation_messages"})!,
                  minLength: 2
                })}
                className="text-sm sm:text-base placeholder-gray-500 pl-4 pr-4 rounded-lg border border-gray-400 w-full py-2 focus:outline-none focus:border-blue-400 text-gray-800" 
                type="text"/>
            <p className="text-red-600 inline text-base font-semibold mt-2">
                {errors?.firstName && errors.firstName.message}
            </p>
          </div>

          <div className="flex flex-col mb-6">
            <label className="mb-1 text-base text-gray-600">{t("lastName")}</label>
              <input
                {...register("lastName", {
                  required: t("requredField", {ns: "validation_messages"})!,
                  minLength: 2
                })}
                className="text-sm sm:text-base placeholder-gray-500 pl-4 pr-4 rounded-lg border border-gray-400 w-full py-2 focus:outline-none focus:border-blue-400 text-gray-800" 
                type="text"/>

            <p className="text-red-600 inline text-base font-semibold mt-2">
                {errors?.lastName && errors.lastName.message}
            </p>
          </div>

          <div className="flex flex-col mb-6">
            <label className="mb-1 text-base text-gray-600">{t("contactInForm")}</label>
              <input
                {...register("additionalContact", {
                  required: t("requredField", {ns: "validation_messages"})!,
                  minLength: 2
                })}
                placeholder={t("contactPlaceholder")!}
                className="text-sm sm:text-base placeholder:text-sm placeholder-gray-500 pl-4 pr-4 rounded-lg border border-gray-400 w-full py-2 focus:outline-none focus:border-blue-400 text-gray-800" 
                type="text"/>
            <p className="text-red-600 inline text-base font-semibold mt-2">
                {errors?.additionalContact && errors.additionalContact.message}
            </p>
          </div>


          <div className="flex w-full">
            <button type="submit" className="flex items-center justify-center focus:outline-none text-white text-sm sm:text-base bg-blue-600 hover:bg-blue-700 rounded py-2 w-full transition duration-150 ease-in">
              <span className="mr-2 uppercase">{t("next")}</span>
            </button>
          </div>
        </form>
      </div>
      </div>    
    }
  </div>
)
}
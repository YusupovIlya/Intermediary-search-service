import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../hooks/useAuth"
import { IUserProfile } from "../models";
import { useGetUserProfileQuery, useUpdateUserProfileMutation } from "../store/intermediarysearchservice.api"

interface UserProfileProps {
    isEditable: boolean
}

export default function UserProfile({isEditable}: UserProfileProps) {
    let emailToQuery = "";
    const { email } = useParams();
    const auth = useAuth();

    if(email != undefined)
        emailToQuery = email;
    else
        emailToQuery = auth.user.email!;

    const {data: user, isLoading, refetch} = useGetUserProfileQuery({email: emailToQuery});
    const [updateUser] = useUpdateUserProfileMutation();
    const [isEditing, setIsEditing] = useState(false);
    const { t } = useTranslation(['buttons', 'user', 'validation_messages', 'toast_messages', 'order']);
    const {register, handleSubmit, formState: { errors }, setValue} = useForm<IUserProfile>({
        mode: "onBlur"
    });

    const setValues = () => {
        setValue("firstName", user?.firstName!);
        setValue("lastName", user?.lastName!);
        setValue("additionalContact", user?.additionalContact!);
      }

    const onSubmit = async (data: IUserProfile) => {
        setIsEditing(false);
        const promise = updateUser({id: auth.user.id!, data: data}).unwrap();
        await toast.promise(
          promise,
          {
            pending: t("toastUpdateProfile.pending", {ns: 'toast_messages'}),
            success: t("toastUpdateProfile.success", {ns: 'toast_messages'})!,
            error: t("toastUpdateProfile.error", {ns: 'toast_messages'})
          }
        );
        refetch();
    }    

    return(
        <div className="p-2">
            <div className="p-8 bg-white shadow mt-20">
                <div className="grid grid-cols-1 md:grid-cols-3">
                        <div className="grid grid-cols-3 text-center order-last md:order-first mt-20 md:mt-0">
                            <div>
                                <p className="font-bold text-gray-700 text-xl">22</p>
                                <p className="text-gray-400">Заказов</p>
                            </div>
                            <div>
                                <p className="font-bold text-gray-700 text-xl">10</p>
                                <p className="text-gray-400">Заявок</p>
                            </div>
                        </div>
                        <div className="relative">
                            <div className="w-48 h-48 bg-indigo-100 mx-auto rounded-full shadow-2xl absolute inset-x-0 top-0 -mt-24 flex items-center justify-center text-indigo-500">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                </svg>
                            </div>
                        </div>
                        {isEditable &&
                        <div className="ml-2 space-x-8 flex justify-between mt-32 md:mt-0 md:justify-center">
                            <button
                                className="text-white py-2 px-4 uppercase rounded bg-blue-400 hover:bg-blue-500 shadow hover:shadow-lg font-medium transition transform hover:-translate-y-0.5"
                                onClick={() => {
                                    setIsEditing(true);
                                    setValues();
                                }}
                                >
                                {t("edit")}
                            </button>
                            <button
                                className="text-white py-2 px-4 uppercase rounded bg-gray-700 hover:bg-gray-800 shadow hover:shadow-lg font-medium transition transform hover:-translate-y-0.5"
                                >
                                {t("remove")}
                            </button>
                        </div>                        
                        }
                </div>
                {!isEditing &&
                <div className="mt-20 flex justify-center border-b pb-12">
                    {isLoading && <p className="text-center text-slate-600">{t("load", {ns: 'order'})}</p>}
                    {!isLoading &&
                    <div className="flex flex-col justify-start">
                        <div className="flex flex-row space-x-4">
                            <h1 className="text-4xl font-medium text-gray-700">{user?.firstName} {user?.lastName}</h1>
                        </div>
                        <div className="flex flex-row space-x-4">
                            <p className="mt-8 text-gray-600 text-lg">Email: </p>
                            <p className="mt-8 text-gray-600 text-lg">{user?.email}</p>
                        </div>
                        <div className="flex flex-row space-x-4">
                            <p className="mt-2 text-gray-600 text-lg">{t("contact", {ns: "user"})}</p>
                            <p className="mt-2 text-gray-600 text-lg">{user?.additionalContact}</p>
                        </div>
                    </div>                     
                    }    
                </div>                
                }
                {isEditing &&
                <form className="text-sm mt-10" onSubmit={handleSubmit(onSubmit)}>
                    <div className="flex flex-col mb-4">
                        <label className="text-gray-700">{t("firstName", {ns: 'user'})}</label>
                        <input
                        {...register("firstName", { required: t("requredField", {ns: "validation_messages"})!, minLength: 2 })}
                        type="text"
                        className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                        />
                        <p className="text-red-600 inline">
                        {errors?.firstName && errors.firstName.message}
                        </p>           
                    </div>

                    <div className="flex flex-col mb-4">
                        <label className="text-gray-700">{t("lastName", {ns: 'user'})}</label>
                        <input
                        {...register("lastName", { required: t("requredField", {ns: "validation_messages"})!, minLength: 2 })}
                        type="text"
                        className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                        />
                        <p className="text-red-600 inline">
                        {errors?.lastName && errors.lastName.message}
                        </p>           
                    </div>

                    <div className="flex flex-col mb-4">
                        <label className="text-gray-700">{t("contactInForm", {ns: 'user'})}</label>
                        <input
                        {...register("additionalContact", { required: t("requredField", {ns: "validation_messages"})!, minLength: 2 })}
                        type="text"
                        className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                        placeholder={t("contactPlaceholder", {ns: 'user'})!}
                        />
                        <p className="text-red-600 inline">
                        {errors?.additionalContact && errors.additionalContact.message}
                        </p>           
                    </div>

                    <div className="w-full flex justify-center items-center">
                        <button 
                            type="submit"
                            className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 "
                            >{t("save")}
                        </button>
                        <button 
                            onClick={() => setIsEditing(false)}
                            type="button"  
                            className="text-white bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-teal-300 dark:focus:ring-teal-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
                            >{t("cancel")}
                        </button>
                    </div>
                </form>              
                }                
            </div>
        </div>
    )

}
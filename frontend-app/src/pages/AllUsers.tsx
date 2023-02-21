import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { useGetAllUsersQuery, useLockUserMutation, useRemoveUserProfileMutation, useUnlockUserMutation } from "../store/intermediarysearchservice.api";
import history from "../hooks/history";
import { Modal } from "../components/Modal";


export default function AllUsers() {
    const {data: users, refetch} = useGetAllUsersQuery(null, {refetchOnMountOrArgChange: 20});
    const [removeUser] = useRemoveUserProfileMutation();
    const [lockUser] = useLockUserMutation();
    const [unlockUser] = useUnlockUserMutation();
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [userId, setUserId] = useState("");
    const { t } = useTranslation(['user', 'buttons', 'toast_messages', 'titles']);
    document.title = t("allUsers", {ns: 'titles'});

    const onDeleteHandler = async () => {
        const promise = removeUser({id: userId}).unwrap();
        await toast.promise(
          promise,
          {
            pending: t("toastDeleteProfile.pending", {ns: 'toast_messages'}),
            success: t("toastDeleteProfile.success", {ns: 'toast_messages'})!,
            error: t("toastDeleteProfile.error", {ns: 'toast_messages'})
          }
        );
        refetch();
    }

    const onLockHandler = async (id: string) => {
        const promise = lockUser({id: id}).unwrap();
        await toast.promise(
          promise,
          {
            pending: t("toastLockProfile.pending", {ns: 'toast_messages'}),
            success: t("toastLockProfile.success", {ns: 'toast_messages'})!,
            error: t("toastLockProfile.error", {ns: 'toast_messages'})
          }
        );
        refetch();
    }

    const onUnLockHandler = async (id: string) => {
        const promise = unlockUser({id: id}).unwrap();
        await toast.promise(
          promise,
          {
            pending: t("toastUnLockProfile.pending", {ns: 'toast_messages'}),
            success: t("toastUnLockProfile.success", {ns: 'toast_messages'})!,
            error: t("toastUnLockProfile.error", {ns: 'toast_messages'})
          }
        );
        refetch();
    }

    return(
        <div className="w-3/4">
          <Modal 
            active={showDeleteModal} 
            setActive={setShowDeleteModal}
            content={
                <div className="p-4">
                  <p className="mt-2 text-lg text-slate-600 not-italic font-medium font-sans">{t("removeConfirm", {ns: 'user'})}</p>
                  <p className="mt-2 text-lg text-slate-600 not-italic font-medium font-sans">{t("warnMessg", {ns: 'user'})}</p>
                  <button 
                  className="mt-2 focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
                  onClick={() => {
                    setShowDeleteModal(false);
                    onDeleteHandler();
                  }}
                  >{t("confirm")}</button>
                </div>
            }/>
            <div className="shadow-md sm:rounded-lg">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">
                            {t("firstName")}
                            </th>
                            <th scope="col" className="px-6 py-3">
                            {t("lastName")}
                            </th>
                            <th scope="col" className="px-6 py-3">
                            Email
                            </th>
                            <th scope="col" className="px-6 py-3">
                            {t("contactInForm")}
                            </th>
                            <th scope="col" className="px-6 py-3">
                            {t("blocked")}
                            </th>
                            <th scope="col" className="px-6 py-3">
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                    {
                        users?.map((item, index) => {
                            return (
                            <tr className="bg-white border-b dark:bg-gray-900 dark:border-gray-700" key={index}>
                                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                    {item.firstName}
                                </th>
                                <td className="px-6 py-4">
                                    {item.lastName}
                                </td>
                                <td className="px-6 py-4">
                                    {item.email}
                                </td>
                                <td className="px-6 py-4">
                                    {item.additionalContact}
                                </td>
                                <td className="px-6 py-4">
                                    {item.lockoutEnd}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex flex-col space-y-1">
                                    <button 
                                        className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                                        onClick={() => {
                                            setUserId(item.id);
                                            setShowDeleteModal(true);
                                        }}
                                    >{t("remove", {ns: 'buttons'})}</button>
                                    {item.lockoutEnd == "" ? 
                                        <button 
                                            className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                                            onClick={() => onLockHandler(item.id)}
                                            >{t("lock", {ns: 'buttons'})}
                                        </button>
                                    :                                         
                                        <button 
                                            className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                                            onClick={() => onUnLockHandler(item.id)}
                                            >{t("unlock", {ns: 'buttons'})}
                                        </button>                               
                                    }                                        
                                    </div>
                                </td>
                            </tr>  
                            )
                        })
                    }
                    </tbody>
                </table>
            </div>            
        </div>
    )
}
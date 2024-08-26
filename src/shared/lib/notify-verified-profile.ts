import toast from "react-hot-toast";
import { verifyUser } from "@/app/actions";

export const notifyVerifiedProfile = async () => {
  try {
    const verifyData = await verifyUser();

    if (verifyData && verifyData.verified && verifyData.message) {
      setTimeout(() => {
        toast.success(verifyData.message, {
          duration: 6000,
        });
      }, 500);
    } else {
      throw Error;
    }
  } catch (error) {
    console.error("Ошибка в подтверждении профиля: ", error);
    setTimeout(() => {
      toast.error("Произошла ошибка при подтверждении профиля", {
        duration: 6000,
      });
    }, 500);
  }
};

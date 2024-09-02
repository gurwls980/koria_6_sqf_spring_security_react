import { instance } from "./util/instance";

export const updateProfileImgApi = async (img) => {
    let response = null;
    try {
        response = await instance.patch("/user/img", {img});    // img=dto
    } catch(error) {
        console.error(error);
        response = error.response;
    }
    return response;
}
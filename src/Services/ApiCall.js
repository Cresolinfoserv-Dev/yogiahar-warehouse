import axios from "axios";

export const commonRequest = async (methods, url, body, header) => {
  const authToken = sessionStorage.getItem("adminToken");
  let config = {
    method: methods,
    url,
    headers: header
      ? header
      : {
          "Content-Type": "application/json",
          Authorization: `${authToken}`,
        },
    data: body,
  };

  return axios(config)
    .then((data) => {
      return data;
    })
    .catch((error) => {
      return error;
    });
};

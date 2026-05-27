import axios from "axios";

const API_URL = import.meta.env.VITE_BackEndURL;
const ACTIVITY_END_POINT = API_URL + "/activitylogs/";

const getHeaders = () => ({
  headers: {
    "content-type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("access")}`,
  },
});


export const getActivityLog = async()=>axios.get(`${ACTIVITY_END_POINT}get-activity-logs`,getHeaders());
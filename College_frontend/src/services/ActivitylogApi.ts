import api from "../interceptor.ts";


const ACTIVITY_END_POINT = "/activitylogs/";




export const getActivityLog = async()=>api.get(`${ACTIVITY_END_POINT}get-activity-logs`);
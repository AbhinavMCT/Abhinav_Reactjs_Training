import {useState,useEffect} from "react";
import {getActivityLog} from "../../services/ActivitylogApi.ts";
import {ActivityLog} from "../../types/Datatypes.ts";

const ViewActivityLog = () =>{
    const [activity, setActivity] = useState<ActivityLog[]>([]);

    useEffect(()=>{
        const loadData = async()=>{
            try{
                const res = await getActivityLog();
                setActivity(res.data);
            }catch(error){
                console.error(error);
            }
        };
        loadData();
    },[]);

    return (
        <div className="student-management-container">
      <div className="management-header">
        <h2>Staff Management</h2>
      </div>

      <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Action Done Role</th>
                <th>action</th>
                <th>Changed Role</th>
              </tr>
            </thead>

            <tbody>
                
              {activity.map((activitys, index) => {
                const rowKey = `activitys-${activitys.id}-${index}`;

                return (
                  <tr key={rowKey}>
                    <td>{activitys.role}</td>

                    <td>{activitys.action}</td>

                    

                    <td>{activitys.table_name}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
      </div>
    </div>
    )
};

export default ViewActivityLog;
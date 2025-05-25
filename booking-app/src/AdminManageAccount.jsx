import {useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import UserAccountManage from './UserAccountManage';

function AdminManageAccount(){

    return(
        <UserAccountManage showDelete = {false} is_user = {false} homepage_path={'/admin_homepage'}/>


    );
}
export default AdminManageAccount
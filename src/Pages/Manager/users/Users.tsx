import { useEffect, useState } from "react";
import Header from "../../../components/Header/Header";
import { axiosInstance } from "../../../service/urls.js";
import { USERS_URL } from "../../../service/api.js"; 

import {
  Table,
  Badge,
  Dropdown,
  Button,
  InputGroup,
  FormControl,
  Spinner,
  Alert,
} from 'react-bootstrap';
import { set } from "react-hook-form";


export default function Users() {
  
  
  const [userList , setUserList] = useState([]);
  // const [users, setUsers] = useState<User[]>([]);
  // const [loading, setLoading] = useState<boolean>(true);
  // const [error, setError] = useState<string | null>(null);

  type User = {
  id: string;
  name: string;
  status: 'Active' | 'Not Active';
  phone: string;
  email: string;
  dateCreated: string;
};

const StatusBadge = ({ status }: { status: User['status'] }) => (
  <Badge bg={status === 'Active' ? 'success' : 'danger' }>{status}</Badge>
);


const getAllUsers = async ()=>{
  try {
    let response :any = await axiosInstance.get(USERS_URL.GET_ALL_USERS);
    // console.log(response.data.data);
    setUserList(response.data.data);
    
    
    
  } catch (error) {
    console.log(error);
    
    
  }

}



  
  

  useEffect(() => {
    getAllUsers();
      
  }, []);







  return (
    <>
    
      <Header />
      <div className="container mt-4">
      <h3>Users</h3>

      {/* Search & Filter */}
      <div className="d-flex justify-content-between mb-3">
        <InputGroup style={{ maxWidth: 300 }}>
          <FormControl placeholder="Search Fleets" />
        </InputGroup>
        <Button variant="outline-secondary">Filter</Button>
      </div>

      {/* Loading State */}
      {/* {loading && <Spinner animation="border" />} */}

      {/* Error Message */}
      {/* {error && <Alert variant="danger">{error}</Alert>} */}

      {/* Users Table */}
      {/* {!loading && !error && ( */}
        <>
          <Table responsive hover bordered>
            <thead className="table-dark">
              <tr>
                <th>User Name</th>
                <th>Status</th>
                <th>Phone Number</th>
                <th>Email</th>
                <th>Date Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {/* {userList.length >0 ? userList.map((user)=> */}
              
              {/* <StatusBadge status={user.status} /> */}
                <tr >
                  <td>name</td>
                  <td>active</td>
                  <td>phone</td>
                  <td>email</td>
                  <td>delte create</td>
                  <td>
                    <div className="dropdown">
  <button className="btn   " type="button" data-bs-toggle="dropdown" aria-expanded="false">
<i className="bi bi-three-dots"></i>  
</button>
  <ul className="dropdown-menu">
    
            <tr>
        <li><a    className="dropdown-item"  ><i className="bi bi-eye  text-success"></i> View</a></li>
        <li><a   className="dropdown-item" ><i className="bi bi-pencil text-success"></i> Edit</a></li>
        <li><a   className="dropdown-item text-danger"><i  className="bi bi-trash "></i> Delete</a></li>
         </tr>
  </ul>
                  </div>
                  </td>
                </tr> 
              
            </tbody>
          </Table>

          {/* Pagination UI (Static for now) */}
          <div className="d-flex justify-content-between align-items-center">
            <span>Showing  users</span>
            <div>
              <Button variant="outline-secondary" size="sm" className="me-1">&lt;</Button>
              <Button variant="outline-secondary" size="sm">&gt;</Button>
            </div>
          </div>
        </>
      {/* )} */}
    </div>
    </>
  );




};

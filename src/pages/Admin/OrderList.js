import React from 'react';
import Layout from '../../components/Layouts/Layout';
import AdminMenu from './AdminMenu';

const OrderList = () => {
    return (
       <Layout title={"Admin - Orders List"}>
 <div className="container-fluid mt-3 p-3">
                <div className="row">
                    <div className="col-md-3"><AdminMenu /></div>
                    <div className="col-md-9">
                        <h2 className="text-center my-4 mb-md-5">
                        <i class="fa-solid fa-box"></i> Order List
                        </h2>    
                    </div>
                </div>
            </div>
       </Layout>
    );
};

export default OrderList;
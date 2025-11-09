
import React, { useEffect, useState } from 'react'
import { LuPlus } from "react-icons/lu";
import { CARD_BG } from "../../Utils/data";
import toast from 'react-hot-toast';
import moment from "moment"
import DashboardLayout from '../../components/Layout/DashboardLayout';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../Utils/axiosInstance';
import { API_PATHS } from '../../Utils/apiPaths';
import SummraryCard from '../../components/Cards/SummraryCard';
import Modal from '../../components/Modal';
import CreateSeesionForm from './CreateSeesionForm';

const Dashboard = () => {
  const navigate = useNavigate();
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [sessions, setSessions] = useState([]);
  const [openDeleteAlert, setOpenDeleteAlert] = useState({
    open: false,
    data: null
  });

  const fetchAllSessions = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.SESSION.GET_ALL);
      setSessions(response.data);
    } catch (error) {
      console.error("Fetching sessions error: ", error);
    }
  };

  const deleteSession = async (sessionData) => {
    try {
      await axiosInstance.delete(API_PATHS.SESSION.DELETE(sessionData._id));
      toast.success("Session deleted successfully!");
      setOpenDeleteAlert({ open: false, data: null });
      fetchAllSessions();
    } catch (error) {
      toast.error("Failed to delete session");
      console.error("Deleting session error:", error);
    }
  };

  useEffect(() => {
    fetchAllSessions();
  }, []);

  return (
    <DashboardLayout>
      <div className='container mx-auto pt-4 pb-4'>
        {/* sessions grid */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-7 pt-1 pb-6 px-4 md:px-6'>
          {sessions?.map((data, index) => (
            <SummraryCard
              key={data?._id}
              colors={CARD_BG[index % CARD_BG.length].bgcolor}
              role={data?.role || ""}
              topicsToFocus={data?.topicsToFocus || ""}
              experience={data?.experience || ""}
              questions={data?.questions || ""}
              description={data?.description || ""}
              lastUpdated={
                data?.updatedAt
                  ? moment(data.updatedAt).format("Do MM YYYY")
                  : ""
              }
              onSelect={() => navigate(`/interview-prep/${data?._id}`)}
              onDelete={() => setOpenDeleteAlert({ open: true, data })}
            />
          ))}
        </div>

        {/* Add new button */}
        <button
          className='h-12 md:h-12 flex items-center justify-center gap-3 bg-linear-to-r from-[#ff9324] to-[#e99a4b] text-sm font-semibold text-white px-7 py-2.5 rounded-full hover:bg-black hover:text-white transition-colors cursor-pointer hover:shadow-2xl hover:shadow-orange-300 fixed bottom-10 md:bottom-20 right-10 md:right-20 z-50'
          onClick={() => setOpenCreateModal(true)}
        >
          <LuPlus className='text-2xl text-white' />
          Add New
        </button>

        {/* Create session modal */}
        <Modal
          isOpen={openCreateModal}
          onClose={() => setOpenCreateModal(false)}
          hideHeader
        >
          <div>
            <CreateSeesionForm />
          </div>
        </Modal>

        {/* Delete confirmation modal */}
        <Modal
          isOpen={openDeleteAlert.open}
          onClose={() => setOpenDeleteAlert({ open: false, data: null })}
        >
          <div className='p-5 text-center'>
            <h3 className='text-lg font-semibold text-gray-800 mb-3'>
              Are you sure you want to delete this session?
            </h3>
            <p className='text-gray-500 text-sm mb-6'>
              This action cannot be undone.
            </p>
            <div className='flex justify-center gap-4'>
              <button
                onClick={() => setOpenDeleteAlert({ open: false, data: null })}
                className='px-5 py-2 rounded-full border border-gray-300 text-gray-600 hover:bg-gray-100 transition'
              >
                Cancel
              </button>
              <button
                onClick={() => deleteSession(openDeleteAlert.data)}
                className='px-5 py-2 rounded-full bg-gradient-to-r from-[#ff9324] to-[#e99a4b] text-white font-semibold hover:opacity-90 transition'
              >
                Delete
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;

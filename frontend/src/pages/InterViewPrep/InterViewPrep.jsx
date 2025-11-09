import React, { useEffect, useState } from 'react'
import moment from "moment";
import {AnimatePresence, motion} from "framer-motion";
import { LuCircleAlert, LuListCollapse } from 'react-icons/lu';
import {toast} from "react-hot-toast"
import { useParams } from 'react-router-dom';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import RoleInfoHeader from './components/RoleInfoHeader';
import axiosInstance from '../../Utils/axiosInstance';
import { API_PATHS } from '../../Utils/apiPaths';
import QuestionCard from '../../components/Cards/QuestionCard';
import AIResponsePreview from './components/AIResponsePreview';
import Drawer from '../../components/Loader/Drawer';
import SkeletonLoader from '../../components/Loader/SkeletonLoader';

const InterViewPrep = () => {

  const {sessionId} = useParams();

  const [sessionData, setSessionData] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  const [openLeanMoreDrawer, setOpenLeanMoreDrawer] = useState(false);
  const [explanation, setExplanation] = useState(null);

  const [isLoading, setIsLoading] = useState(false);
  const [isUpdateLoader, setIsUpdateLoader] = useState(false);

  // fetch session data by session id
  const fetchSessionDetailsById = async () =>{
    try {
      const reponse = await axiosInstance.get(API_PATHS.SESSION.GET_ONE(sessionId))

      if(reponse.data && reponse.data.sessions) {
        setSessionData(reponse.data.sessions)
      }
    } catch(error) {
      console.error("Error: ", error)
    }
  }


  // generate concept explanation
  const generateConceptExplanation = async (question) => {
        try {
          setErrorMsg("");
          setExplanation(null)

          setIsLoading(true);
          setOpenLeanMoreDrawer(true);

          const response = await axiosInstance.post(
            API_PATHS.AI.GENERATE_EXPLANATION,
            {
              question
            }
          );

          if(response.data) {
            setExplanation(response.data)
          }
        } catch(error) {
          setExplanation(null)
          setErrorMsg("failed to generating explanation");
          console.error("Error: ", error)
        } finally{
          setIsLoading(false)
        }
  }

  // pin question
  const toggleQuestionPinStatus = async (questionId) => {
      try{
        const response = await axiosInstance.post(
          API_PATHS.QUESTION.PIN(questionId)
        );
        console.log(response);

        if(response.data && response.data.question) {
        fetchSessionDetailsById();
      }
      } catch(error) {
          console.error("Error: ", error)
      }
  }

  // add more questions to a session
const uploadMoreQuestions = async () => {
  try {
    setIsUpdateLoader(true);
    setErrorMsg("");

    // Call AI API to generate more questions
    const aiResponse = await axiosInstance.post(
      API_PATHS.AI.GENERATE_QUESTIONS,
      {
        role: sessionData?.role,
        experience: sessionData?.experience,
        topicsToFocus: sessionData?.topicsToFocus,
        numberOfQuestions: 10,
      }
    );

    // Expected array: [{question, answer}]
    const generateQuestions = aiResponse.data;


    // Send new questions to backend
    const response = await axiosInstance.post(
      API_PATHS.QUESTION.ADD_TO_SESSION,
      {
        sessionId,
        questions: generateQuestions, 
      }
    );

    if (response.data) {
      toast.success("Added more Q&A successfully!");
      fetchSessionDetailsById(); // refresh data
    }
  } catch (error) {
    console.error("Error:", error);
    if (error.response && error.response.data.message) {
      setErrorMsg(error.response.data.message);
    } else {
      setErrorMsg("Failed to add more questions. Please try again.");
    }
  } finally {
    setIsUpdateLoader(false);
  }
};


  useEffect(() => {
    if(sessionId) {
      fetchSessionDetailsById();
    }
    return () => {};
  }, []);



  return (
    <DashboardLayout>
      <RoleInfoHeader
      role= {sessionData?.role || ""}
      topicsToFocus = {sessionData?.topicsToFocus || ""}
      experience = {sessionData?.experience || ""}
      questions = {sessionData?.questions.length || "-"}
      description = {sessionData?.description || ""}
      lastUpdated = {
        sessionData?.updatedAt
        ? moment(sessionData.updatedAt).format("Do MM YYYY")
        : ""
      }
      />

      <div className='container mx-auto pt-4 pb-4 px-4 md:px-0'>
        <h2 className='text-lg font-semibold color-black ml-6'>Interview Q & A</h2>

        <div className='grid grid-cols-12 gap-4 mt-5 mb-10'>
          <div
          className={`col-span-12 ${
            openLeanMoreDrawer ? "md:col-span-7" : "md:col-span-8"
          }`}
          >
            <AnimatePresence>
  {sessionData?.questions?.map((data, index) => (
    <motion.div
      key={data._id || index}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{
        duration: 0.4,
        type: "spring",
        stiffness: 100,
        delay: index * 0.1,
        damping: 15,
      }}
      layout
      layoutId={`question-${data._id || index}`}
    >
      <>
      <QuestionCard
        question={data?.question}
        answer={data?.answer}
        onLearnMore={() => generateConceptExplanation(data.question)}
        isPinned={data?.isPinned}
        onTogglePin={() => toggleQuestionPinStatus(data._id)}
      />

      {!isLoading && 
      sessionData?.questions?.length == index + 1 && (
        <div className='flex items-center justify-center mt-5'>
          
          <button
  onClick={uploadMoreQuestions}
  disabled={isUpdateLoader}
  className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-white font-medium transition-all duration-200 shadow-sm ${
    isUpdateLoader
      ? "bg-gray-400 cursor-not-allowed"
      : "bg-black hover:bg-gray-800 active:scale-95"
  }`}
>
  {isUpdateLoader ? (
    <>
      <svg
        className="w-5 h-5 animate-spin text-white"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v4l3.5-3.5L12 0v4a8 8 0 018 8h-4l3.5 3.5L20 12h-4a8 8 0 01-8 8v-4l-3.5 3.5L8 20v-4a8 8 0 01-8-8h4l-3.5-3.5L0 12h4z"
        ></path>
      </svg>
      <span>Loading...</span>
    </>
  ) : (
    <>
      <LuListCollapse className="text-lg" />
      <span>Load More</span>
    </>
  )}
</button>

        </div>
      )}
      </>
    </motion.div>
  ))}
</AnimatePresence>

          </div>
        </div>

        <div>
          <Drawer
          isOpen = {openLeanMoreDrawer}
          onClose = {() => setOpenLeanMoreDrawer(false)}
          title = {!isLoading && explanation?.title}
          >
            {errorMsg && (
              <p className='flex gap-2 text-sm text-amber-600 font-medium'>
                <LuCircleAlert className='mt-1'/> {errorMsg}
              </p>
            )}
            {isLoading && <SkeletonLoader/>}
            {!isLoading && explanation && (
              <AIResponsePreview content={explanation?.explanation}/>
            )}
          </Drawer>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default InterViewPrep
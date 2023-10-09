import React, { useEffect } from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from 'chart.js';
import { FaUsers } from 'react-icons/fa';
import HomeLayout from '../../Layouts/HomeLayout';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { deleteCourses, getAllCourses } from '../../Redux/Slices/CourseSlice';
import { getStatsData } from '../../Redux/Slices/StatsSlice';
import { getPaymentRecord } from '../../Redux/Slices/RazorpaySlice';
import { Pie, Bar } from 'react-chartjs-2';
import { FcSalesPerformance } from 'react-icons/fc';
import { BsCollectionPlayFill, BsTrash } from 'react-icons/bs';
import { MdOutlineModeEdit } from 'react-icons/md';

// CHARTJS
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { allUsersCount, subscribedCount } = useSelector((state) => state.stat);

  const { allPayments, monthlySalesRecord } = useSelector((state) => state.razorpay);

  // const pay = useSelector((state)=>state.razorpay)

  // console.log(pay);



  const userData = {
    labels: ['Registered User', 'Enrolled User'],
    fontColor: 'white',
    datasets: [
      {
        label: 'User Details',
        data: [allUsersCount, subscribedCount],
        backgroundColor: ['yellow', 'green'],
        borderWidth: 1,
        borderColor: ['yellow', 'green'],
      },
    ],
  };

  const salesData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jue', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'],
    fontColor: 'white',
    datasets: [
      {
        label: 'Sales / Month',
        data: monthlySalesRecord,
        backgroundColor: ['rgb(255,99,132'],
        borderColor: 'white',
        borderWidth: 2,
      },
    ],
  };

  const myCourses = useSelector((state) => state?.course?.courseData);

  async function onCourseDelete(id) {
    if (window.confirm('Are you sure you want to delete the course ?')) {
      const res = await dispatch(deleteCourses(id));
      if (res?.payload?.success) {
        await dispatch(getAllCourses());
      }
    }
  }

  useEffect(() => {
        (
            async () => {
                await dispatch(getAllCourses());
                await dispatch(getStatsData());
                await dispatch(getPaymentRecord())
            }
        )()
    }, [])

  return (
    <HomeLayout>
      <div className="min-h-[90vh] pt-5 flex flex-col flex-wrap gap-10 text-white">
        <h1 className="text-center text-5xl font-semibold text-yellow-500">Admin Dashboard</h1>
        <div className="grid grid-cols-2 gap-5 m-auto mx-10">
          <div className="flex flex-col items-center gap-10 p-5 shadow-lg rounded-md">
            <div className="w-80 h-80">
              <Pie data={userData} />
            </div>
            <div className="grid grid-cols-2 gap-5">
              <div className="flex items-center justify-between p-5 gap-5 rounded-md shadow-md">
                <div className="flex flex-col items-center">
                  <p className="font-semibold">Registerd Users</p>
                  <h3 className="text-4xl font-bold">{allUsersCount}</h3>
                </div>
                <FaUsers className="text-5xl text-yellow-500" />
              </div>
              <div className="flex items-center justify-between p-5 gap-5 rounded-md shadow-md">
                <div className="flex flex-col items-center">
                  <p className="font-semibold">Subscribed Users</p>
                  <h3 className="text-4xl font-bold">{subscribedCount}</h3>
                </div>
                <FaUsers className="text-5xl text-green-500" />
              </div>
            </div>
          </div>

          {/* SALES */}
          <div className="flex flex-col items-center gap-10 p-5 shadow-lg rounded-md">
            <div className="h-80 w-full relative">
              <Bar
                className="absolute bottom-0 h-80 w-full"
                data={salesData}
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center justify-between p-5 gap-5 rounded-md shadow-md">
                <div className="flex flex-col items-center">
                  <p className="font-semibold">Subscription count </p>
                  <h3 className="text-4xl font-bold">{allPayments?.count}</h3>
                </div>
                <FcSalesPerformance className="text-5xl text-yellow-500" />
              </div>
              <div className="flex items-center justify-between p-5 gap-5 rounded-md shadow-md">
                <div className="flex flex-col items-center">
                  <p className="font-semibold">Total Revenue</p>
                  <h3 className="text-4xl font-bold">{allPayments?.count * 499}</h3>
                </div>
                <FcSalesPerformance className="text-5xl text-yellow-500" />
              </div>
            </div>
          </div>
        </div>
        <div className="mx-[10%] w-[80%] self-center flex flex-col items-center justify-center gap-10 mb-10">
          <div className="flex w-full items-center justify-between">
            <h1 className="text-center font-semibold text-3xl">Course overview</h1>
            <button
              onClick={() => navigate('/course/create')}
              className="w-fit bg-yellow-500 hover:bg-yellow-600 transition-all ease-in-out duration-300 rounded px-4 py-2 font-semibold text-lg cursor-pointer">
              Create new course
            </button>
          </div>
          {/* TABLE */}
            <table className="table overflow-x-scroll">
              <thead>
                <tr>
                  <th>S No.</th>
                  <th>Course Title</th>
                  <th>Course Category</th>
                  <th>Instructor</th>
                  <th>Total Lectures</th>
                  <th>Course Description</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {myCourses?.map((course, index) => {
                  return (
                    <tr key={course?._id}>
                      <td>{index + 1}</td>
                      <td>
                        <textarea
                          readOnly
                          className="w-40 h-auto bg-transparent resize-none"
                          value={course?.title}></textarea>
                      </td>
                      <td>{course?.category}</td>
                      <td>{course?.createdBy}</td>
                      <td>{course?.numbersOfLectures}</td>
                      <td className="max-w-28 overflow-hidden text-ellipsis whitespace-nowrap">
                        <textarea
                          readOnly
                          className="w-80 h-auto bg-transparent resize-none"
                          value={course?.description}></textarea>
                      </td>

                      <td className="flex items-center gap-4">
                        {/* to edit the course */}
                        <button
                          onClick={() =>
                            navigate('/course/create', {
                              state: {
                                initialCourseData: {
                                  newCourse: false,
                                  ...course,
                                },
                              },
                            })
                          }
                          className="bg-yellow-500 hover:bg-yellow-600 transition-all ease-in-out duration-300 text-xl py-2 px-4 rounded-md font-bold">
                          <MdOutlineModeEdit />
                        </button>

                        {/* to delete the course */}
                        <button
                          onClick={() => onCourseDelete(course._id)}
                          className="bg-red-500 hover:bg-red-600 transition-all ease-in-out duration-30 text-xl py-2 px-4 rounded-md font-bold">
                          <BsTrash />
                        </button>

                        {/* to CRUD the lectures */}
                        <button
                          onClick={() =>
                            navigate('/course/displaylectures', {
                              state: { ...course },
                            })
                          }
                          className="bg-green-500 hover:bg-green-600 transition-all ease-in-out duration-30 text-xl py-2 px-4 rounded-md font-bold">
                          <BsCollectionPlayFill />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

        </div>
      </div>
    </HomeLayout>
  );
};

export default AdminDashboard;

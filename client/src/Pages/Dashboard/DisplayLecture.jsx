import React, { useEffect, useState } from 'react';
import HomeLayout from '../../Layouts/HomeLayout';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { deleteCourseLectures, getCourseLectures } from '../../Redux/Slices/LectureSlice';

const DisplayLecture = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { state } = useLocation();
  const { lectures } = useSelector((state) => state.lecture);
  const { role } = useSelector((state) => state.auth);

  const [currentVideo, setCurrentVideo] = useState(0);

  async function onLectureDelete(courseId, lectureId) {
    console.log(courseId);
    console.log(lectureId);
    await dispatch(deleteCourseLectures({ courseId: courseId, lectureId: lectureId }));
    await dispatch(getCourseLectures(courseId));
  }

  useEffect(() => {
    console.log(state);
    if (!state) navigate('/courses');
    dispatch(getCourseLectures(state._id));
  }, []);

  return (
    <HomeLayout>
      <div className="flex flex-col gap-10 items-center justify-center min-h-[90vh] py-10 text-white">
        <div className="text-center text-2xl font-semibold text-yellow-500">
          Course Name: {state?.title}
        </div>
        {lectures && lectures.length > 0 ? (
          <div className="flex justify-center gap-10 w-full">
            {/* Left section for video and displaying course details to admin */}
            <div className="space-y-5 w-[28rem] p-2 rounded-lg shadow-[0_0_10px_black]">
              <video
                src={lectures && lectures[currentVideo]?.lecture?.secure_url}
                className="object-fill rounded-tl-lg rounded-tr-lg w-full"
                controls
                disablePictureInPicture
                muted
                controlsList="nodownload"></video>
              <div className="">
                <h1>
                  <span className="text-yellow-500">Titile: </span>
                  {lectures && lectures[currentVideo]?.title}
                </h1>
                <p>
                  <span className="text-yellow-500 line-clamp-4">Description: </span>
                  {lectures && lectures[currentVideo]?.description}
                </p>
              </div>
            </div>
            {/* {right section for displaying list of lecture} */}
            <ul className="w-[28rem] p-2 rounded-lg shadow-[0_0_10px_black] space-y-4">
              <li className="font-semibold text-xl text-yellow-500 flex items-center justify-between">
                <p>Lecture list</p>
                {role === 'ADMIN' && (
                  <button
                    onClick={() => navigate('/course/addlecture', { state: { ...state } })}
                    className="btn-primary px-2 py-1 rounded-md font-semibold text-sm">
                    Add new lecture
                  </button>
                )}
              </li>
              {lectures &&
                lectures.map((lecture, idx) => {
                  return (
                    <li
                      className="space-y-2"
                      key={lecture._id}>
                      <p
                        className="cursor-pointer bg-white text-blue-900 px-1 rounded-sm"
                        onClick={() => setCurrentVideo(idx)}>
                        <span> Lecture {idx + 1} : </span>
                        {lecture?.title}
                      </p>
                      {role === 'ADMIN' && (
                        <button
                          onClick={() => onLectureDelete(state?._id, lecture?._id)}
                          className="btn-accent px-2 py-1 rounded-md font-semibold text-sm">
                          Delete lecture
                        </button>
                      )}
                    </li>
                  );
                })}
            </ul>
          </div>
        ) : (
          role === 'ADMIN' && (
            <button
              onClick={() => navigate('/course/addlecture', { state: { ...state } })}
              className="btn-primary px-2 py-1 rounded-md font-semibold text-sm">
              Add new lecture
            </button>
          )
        )}
      </div>
    </HomeLayout>
  );
};

export default DisplayLecture;

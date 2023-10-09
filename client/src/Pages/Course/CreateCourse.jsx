import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { createNewCourse } from '../../Redux/Slices/CourseSlice';
import HomeLayout from '../../Layouts/HomeLayout';
import { AiOutlineLeft } from 'react-icons/ai';

const CreateCourse = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [userInput, setUserInput] = useState({
    title: '',
    category: '',
    createdBy: '',
    description: '',
    thumbnail: null,
    previewImage: '',
  });

  function handleImageUpload(e) {
    e.preventDefault();
    const uploadedImage = e.target.files[0];
    if (uploadedImage) {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(uploadedImage);
      fileReader.addEventListener('load', function () {
        setUserInput({
          ...userInput,
          previewImage: this.result,
          thumbnail: uploadedImage,
        });
      });
    }
  }

  function handleUserInput(e) {
    const { name, value } = e.target;
    setUserInput({
      ...userInput,
      [name]: value,
    });
  }

  async function onFormSubmit(e) {
    e.preventDefault();
    if (
      !userInput.title ||
      !userInput.description ||
      !userInput.category ||
      !userInput.thumbnail ||
      !userInput.createdBy
    ) {
      toast.error('All field are mandatory');
      return;
    }
    const response = await dispatch(createNewCourse(userInput));
    if (response?.payload?.success) {
      setUserInput({
        title: '',
        category: '',
        createdBy: '',
        description: '',
        thumbnail: null,
        previewImage: '',
      });
      navigate('/courses');
    }
  }

  return (
    <HomeLayout>
      <div className="flex items-center justify-center h-[100vh]">
        <form noValidate
          onSubmit={onFormSubmit}
          className="flex flex-col justify-center gap-5 rounded-lg p-4 text-white w-[700px] my-10 shadow-[0_0_10px_black] relative">
          <Link onClick={()=>navigate(-1)} className="absolute top-8 text-2xl link text-accent">
            <AiOutlineLeft />
          </Link>
          <h1 className="text-center font-bold text-2xl">Create new course</h1>
          <main className='grid grid-cols-2 gap-x-10'>
            <div className="gap-y-6">
              <div className="">
                <label htmlFor="image_uploads" className='cursor-pointer'>
                  {userInput.previewImage ? (
                    <img src={userInput.previewImage} alt="" className='w-full h-44 m-auto border' />
                  ):(
                    <div className="w-full h-44 m-auto flex items-center justify-center border">
                      <h1 className='font-bold text-lg'>Upload your course thumbnail</h1>
                    </div>
                  )
                  }
                </label>
                <input type="file" className='hidden' id='image_uploads' accept='.jpg,.jpeg,.png' name='image_uploads' onChange={handleImageUpload}/>
                </div>
                <div className="flex flex-col gap-1">
                  <label htmlFor="title" className='text-lg font-semibold'>Course title</label>
                  <input type="rext" name='title' required id='title' placeholder='Enter course title' className='bg-transparent px-2 py-1 border' onChange={handleUserInput} value={userInput.title}  />
                </div>
            </div>
            <div className="flex flex-col gap-1">
            <div className="flex flex-col gap-1">
                  <label htmlFor="createdBy" className='text-lg font-semibold'>Enter course Instructor</label>
                  <input type="text" name='createdBy' required id='createdBy' placeholder='Enter course Instructor' className='bg-transparent px-2 py-1 border' onChange={handleUserInput} value={userInput.createdBy}  />
                </div>
            <div className="flex flex-col gap-1">
                  <label htmlFor="category" className='text-lg font-semibold'>Enter course Category</label>
                  <input type="text" name='category' required id='category' placeholder='Enter course category' className='bg-transparent px-2 py-1 border' onChange={handleUserInput} value={userInput.category}  />
                </div>
            <div className="flex flex-col gap-1">
                  <label htmlFor="description" className='text-lg font-semibold'>Enter course description</label>
                  <textarea type="text" name='description' required id='description' placeholder='Enter course description' className='bg-transparent px-2 py-1 h-24 overflow-y-scroll border resize-none' onChange={handleUserInput} value={userInput.description}  />
                </div>
            </div>
          </main>
          <button className='w-full bg-yellow-600 hover:bg-yellow-500 transition-all ease-in-out duration-300 py-2 rounded-sm text-lg cursor-pointer'>Create Course</button>
        </form>
      </div>
    </HomeLayout>
  );
};

export default CreateCourse;

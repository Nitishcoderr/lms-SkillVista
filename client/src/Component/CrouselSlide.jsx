import React from 'react'

const CrouselSlide = ({image,title,description,slideNumber,totalSlide}) => {
  return (
    <div id={`slide${slideNumber}`} className="carousel-item relative w-full">
    <div className='flex justify-center flex-col items-center gap-4 px-[15%]'>
    <img src={image} className="w-40 rounded-full border-2 border-gray-400" />
    <p className='text-xl text-gray-200'>{description}</p>
    <h3 className='text-2xl font-semibold'>{title}</h3>
    <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
      <a href={`#slide${(slideNumber == 1 ? totalSlide : (slideNumber -1))}`} className="btn btn-circle">❮</a> 
      <a href={`#slide${(slideNumber) % totalSlide + 1 }`} className="btn btn-circle">❯</a>
    </div>
    </div>
  </div> 
  )
}

export default CrouselSlide

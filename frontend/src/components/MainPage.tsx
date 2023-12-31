import React from 'react'
import './MainPage.css'

const MainPage = () => {
    return (
        <main className='chat-section-wapper'>
            <section className='section1'>
                <div className='profileSection'>
                    <img src='/profile-pic.avif' alt='profile pic' className='profile-pic-img'/>
                    <p className='user-name'>User 1</p>
                </div>
                <div className='profileSection'>
                    <img src='/profile-pic.avif' alt='profile pic' className='profile-pic-img'/>
                    <p className='user-name'>User 2kvjgkuvutkuc</p>
                </div>
            </section>
            <section className='section2'>
                <div className='messageSection'>
                    <p className='message'>Hello! How are you?</p>
                </div>
                <div className='inputMessageSection'>
                    <input type='text' />
                    <button className='send-btn'>Send</button>
                </div>
            </section>
        </main>
      
  )
}

export default MainPage

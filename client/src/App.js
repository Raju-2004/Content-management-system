import Header from './components/Header';
import Body from './components/Body';
import './App.css';
import Footer from './components/Footer';
import Dashboard from './components/Dashboard';
import { ToastContainer } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';
import {
  createBrowserRouter, Outlet
} from "react-router-dom";
import CreatePost from './components/CreatePost';
import Posts from './components/Posts';

import { MyContext } from './components/MyContext';
import { useState } from 'react';
import EditPost from './components/EditPost';
import Category from './components/Category';
import Blogs from './components/Blogs';
import SinglePost from './components/SinglePost';
import UserPosts from './components/UserPosts';
import Comments from './components/Comments';

console.log(localStorage.getItem('UserEmail'));

function App() {
  const [Posts,setPosts] = useState([]);
  const [CategoryValues,SetCategoryValues] = useState([]);

  return (
    <div className="App">
      <MyContext.Provider value={{Posts,setPosts,CategoryValues,SetCategoryValues}}>
      <Header />
      <div className='outlet'>
      <Outlet/>
      </div>
      <Footer/>
      <ToastContainer/>
      </MyContext.Provider>
    </div>
  );
}

export const AppRouter = createBrowserRouter(
  [
    {
      path:"/",
      element:<App/>,
      children:[
        {
          path:"/",
          element:<Body/>
        },
        {
          path:"/dashboard",
          element:<Dashboard/>,
          children:[
            {
              path:"/dashboard",
              element:<UserPosts/>
            },
            {
              path:'/dashboard/posts/create',
              element:<CreatePost/>
            },
            {
              path:'/dashboard/posts',
              element:<Posts/>
            },
            {
              path:'/dashboard/post/:id',
              element:<SinglePost/>
            },
            {
              path:'/dashboard/posts/edit/:id',
              element:<EditPost/>
            },
            {
              path:'/dashboard/categories',
              element:<Category/>
            },
            {
              path:'/dashboard/comments',
              element:<Comments/>
            },
            {
              path:'/dashboard/categories/edit/:id',
              element:<Category/>
            }
          ],
        },
        {
          path:'/blogs',
          element:<Blogs/>
        },
        {
          path:'/blogs/post/:id',
          element:<SinglePost/>
        }
      ],
    },
  ]
)

export default App;

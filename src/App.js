import './App.css';
import 'react-toastify/dist/ReactToastify.css';
import { config } from './config/config';
import { Route, Routes } from 'react-router-dom';
import DashboardPage from './pages/Dashboard/Dashboard.page'
import UsersPage from './pages/Users/Users.page'
import BooksPage from './pages/Books/Books.page'
import BorrowedBooksPage from './pages/BorrowedBooks/BorrowedBooks.page'
import Menu from './components/Menu/Menu'
import TopBar from './components/TopBar/TopBar'
import UserDetailPage from './pages/UserDetail/UserDetail.page';
import BookDetailPage from './pages/BookDetail/BookDetail.page';
import { ToastContainer } from 'react-toastify';
import LoginPage from './pages/Login/Login.page';
import PrivateRoute from './pages/PrivateRoute';
import { AuthProvider } from './context/AuthContext';

function App() {

  return (
    <AuthProvider>
      <TopBar />
      <Menu />

      <main className="Main">
        <Routes>
          <Route path={config.paths.login} element={<LoginPage />} />          
          <Route path={config.paths.dashboard} element={<PrivateRoute> <DashboardPage /></PrivateRoute>} />
          <Route path={config.paths.users} element={<PrivateRoute><UsersPage /></PrivateRoute>} />
          <Route path={`${config.paths.users}/:id`} element={<PrivateRoute><UserDetailPage /></PrivateRoute>} />
          <Route path={config.paths.books} element={<PrivateRoute><BooksPage /></PrivateRoute>} />
          <Route path={config.paths.bookDetail + '/:isbn'} element={<PrivateRoute> <BookDetailPage/> </PrivateRoute>} /> 
          <Route path={config.paths.borrowedBooks} element={<PrivateRoute> <BorrowedBooksPage/> </PrivateRoute>} /> 
          <Route
            path="*"
            element={
              <main style={{ padding: "1rem" }}>
                <p>There's nothing here!</p>
              </main>
            }
          />
        </Routes>
        <ToastContainer autoClose={5000} theme={'dark'} />
      </main>
    </AuthProvider>
  );
}

export default App;

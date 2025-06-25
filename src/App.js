import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Amplify } from 'aws-amplify';
import { Authenticator, useAuthenticator } from '@aws-amplify/ui-react';

import MapComponent from './MapComponent';
import Startpage from './Startpage';
import LoginPage from './LoginPage';
const awsExports = {
  "aws_project_region": "us-east-1", // あなたのリージョン
  "aws_cognito_region": "us-east-1", // あなたのリージョン
  "aws_user_pools_id": "us-east-1_QCPqztmha",
  "aws_user_pools_web_client_id": "5l6lepanarm02p0ak8cl10nab7",
};

Amplify.configure(awsExports);

// ★★★ ページを保護するためのコンポーネント ★★★
// ログインしていないユーザーをログインページにリダイレクトさせる
const ProtectedRoute = ({ children }) => {
  const { authStatus } = useAuthenticator(context => [context.authStatus]);
  
  // 認証状態が'authenticated'でない場合はログインページにリダイレクト
  if (authStatus !== 'authenticated') {
    return <Navigate to="/login" replace />;
  }
  
  // 認証済みの場合は、子コンポーネント（マップページなど）を表示
  return children;
};


function App() {
  return (
    <Authenticator.Provider>
      <BrowserRouter>
        <Routes>
          {/* ★★★ ここが修正点 ★★★ */}
          {/* スタートページもProtectedRouteで囲んで保護する */}
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <Startpage />
              </ProtectedRoute>
            } 
          />

          {/* ログインページ */}
          <Route path="/login" element={<LoginPage />} />

          {/* マップページ（保護されたまま） */}
          <Route 
            path="/map" 
            element={
              <ProtectedRoute>
                <MapComponent />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </BrowserRouter>
    </Authenticator.Provider>
  );
}

export default App;
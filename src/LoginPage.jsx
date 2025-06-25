import React, { useEffect } from 'react';
import { Authenticator, useAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  // useAuthenticatorフックをコンポーネントのトップレベルで呼び出す
  const { authStatus } = useAuthenticator(context => [context.authStatus]);
  const navigate = useNavigate();

  // useEffectフックもトップレベルで呼び出す
  useEffect(() => {
    // ユーザーの認証状態が 'authenticated' (認証済み) になったら実行
    if (authStatus === 'authenticated') {
      // ホームページ ('/') にリダイレクトする
      navigate('/');
    }
  }, [authStatus, navigate]); // authStatusかnavigateが変更された時に再実行

  // 認証が済んでいないユーザーには、Authenticatorコンポーネント（ログインフォーム）を表示する
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Authenticator hideSignUp={true} />
    </div>
  );
};

export default LoginPage;
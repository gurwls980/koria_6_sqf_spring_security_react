import './App.css';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import IndexPage from './pages/IndexPage/IndexPage';
import UserJoinPage from './pages/UserJoinPage/UserJoinPage';
import UserLoginPage from './pages/UserLoginPage/UserLoginPage';
import { useQuery } from 'react-query';
import { instance } from './apis/util/instance';
import UserProfilePage from './pages/UserProfilePage/UserProfilePage';
import { useEffect, useState } from 'react';
import OAuth2JoinPage from './pages/OAuth2JoinPage/OAuth2JoinPage';

function App() {
    // const [refresh, setRefresh] = useState(false);

    const location = useLocation();
    const navigate = useNavigate();
    const [ authRefresh, setAuthRefresh ] = useState(true);
    
    /*
        페이지 이동시 Auth(로그인, 토큰) 확인
        1. index(home) 페이지를 먼저 들어가서 로그인 페이지로 이동한 경우 -> index로 이동
        2. 탭을 열자마자 주소창에 수동입력을 통해 로그인 페이지로 이동한 경우 -> index로 이동
        3. 로그인 후 사용 가능한 페이지로 들어갔을 때 로그인 페이지로 이동한 경우 -> 이전 페이지 이동
        4. 로그인이 된 상태 -> 어느 페이지든 이동
    */
    useEffect(() => {
        if(!authRefresh) {
            setAuthRefresh(true)
        }
    }, [location.pathname]);

    const accessTokenValid = useQuery(  // 주로 get요청을 사용할때
        ["accessTokenValidQuery"],  // 키 값, 디펜던시
        async () => {   // 요청 메소드
            // setRefresh(false);
            // console.log("쿼리에서 요청!!!");
            return await instance.get("/auth/access", {
                params: {
                    accessToken: localStorage.getItem("accessToken")
                }
            });
        }, {    // 옵션
        // enabled: refresh,   // enabled이 true일때동작(스위치 역할)
        // refetch: 다시 요청을받아서 사용한다
        // retry: 요청실패했을때 재요청
        // interval: 시간설정
        // refetchOnWindowFocus: false,
            enabled: authRefresh,
            retry: 0,
            refetchOnWindowFocus: false,
            onSuccess: response => {
                const permitAllPaths = ["/user"];
                for(let permitAllPath of permitAllPaths) {
                    if (location.pathname.startsWith(permitAllPath)) {
                        navigate(-1);
                        break;
                    }
                }
            },
            onError: error => {
                const authPaths = ["/profile"];
                for (let authPath of authPaths) {
                    if (location.pathname.startsWith(authPath)) {
                        navigate("user/login");
                        break;
                    }
                }
            }
            // onSuccess: response => {    // onSuccess: 요청에대한 응답이 성곡적으로 이루어졌을때
            //     // console.log("OK 응답!!!");
            //     console.log(response.data);
            // },
            // onError: error => {
            //     // console.log("오류!!");
            //     console.error(error);
            // }
        }
    );

    const userInfo = useQuery(
        ["userInfoQuery"],
        async () => {
            return await instance.get("/user/me");
        }, {
        enabled: accessTokenValid.isSuccess && accessTokenValid.data?.data,
        refetchOnWindowFocus: false,
        // onSuccess: response => {
        //     console.log(response);
        // }
    }
    );

    // console.log(accessTokenValid);

    // console.log("그냥 출력!!!");
    // console.log(accessTokenValid.data);

    // useEffect(() => {
    //     // const accessToken = localStorage.getItem("accessToken");
    //     // if (!!accessToken) {
    //     //     setRefresh(true);
    //     // }
    //     console.log("Effect!!!");
    // }, [accessTokenValid.data])

    return (
        <Routes>
            <Route path="/" element={<IndexPage />} />
            <Route path="/user/join" element={<UserJoinPage />} />
            <Route path="/user/join/oauth2" element={<OAuth2JoinPage />} />
            <Route path="/user/login" element={<UserLoginPage />} />
            <Route path="/profile" element={<UserProfilePage />} />

            <Route path="/admin/*" element={<></>} />
            <Route path="/admin/*" element={<h1>Not Found</h1>} />
            <Route path="/*" element={<h1>Not Found</h1>} />
        </Routes>
    );
}

export default App;

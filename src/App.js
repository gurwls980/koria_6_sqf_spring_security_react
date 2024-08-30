import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import IndexPage from './pages/IndexPage/IndexPage';
import UserJoinPage from './pages/UserJoinPage/UserJoinPage';
import UserLoginPage from './pages/UserLoginPage/UserLoginPage';
import { useEffect } from 'react';
import { useQuery } from 'react-query';
import { instance } from './apis/util/instance';

function App() {
    // const [refresh, setRefresh] = useState(false);

    const accessTokenValid = useQuery(  // 주로 get요청을 사용할때
        ["accessTokenValidQuery"],  // 키 값, 디펜던시
        async () => {   // 요청 메소드
            // setRefresh(false);
            console.log("쿼리에서 요청!!!");
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
            retry: 0,
            onSuccess: response => {    // onSuccess: 요청에대한 응답이 성곡적으로 이루어졌을때
                // console.log("OK 응답!!!");
                console.log(response);
            },
            onError: error => {
                // console.log("오류!!");
                console.error(error);
            }
        }
    );

    const userInfo = useQuery(
        ["userInfoQuery"],
        async () => {
            return await instance.get("/user/me");
        }, {
            enabled: accessTokenValid.isSuccess && accessTokenValid.data?.data,
            onSuccess: response => {
                console.log(response);
            }
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
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<IndexPage />} />
                <Route path="/user/join" element={<UserJoinPage />} />
                <Route path="/user/login" element={<UserLoginPage />} />

                <Route path="/admin/*" element={<></>} />
                <Route path="/admin/*" element={<h1>Not Found</h1>} />
                <Route path="/*" element={<h1>Not Found</h1>} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;

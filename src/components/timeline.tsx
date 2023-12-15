import {
  collection,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { styled } from "styled-components";
import { db } from "../firebase";
import Tweet from "./tweet";
import { Unsubscribe } from "firebase/auth";

export interface ITweet {
  id: string;
  photo?: string /* photo는 필수값이 아니라고 설정 */;
  tweet: string;
  userId: string;
  username: string;
  createdAt: number;
}

const Wrapper = styled.div`
  display: flex;
  gap: 10px;
  flex-direction: column;
`;

export default function Timeline() {
  // React에 이건 트윗 배열이고, 기본값은 빈 배열이라고 알려줄 수 있음
  const [tweets, setTweet] = useState<ITweet[]>([]);

  useEffect(() => {
    let unsubscribe: Unsubscribe | null = null;
    const fetchTweets = async () => {
      const tweetsQuery = query(
        collection(db, "tweets"),
        orderBy("createdAt", "desc"),
        limit(25)
      );
      // const snapshot = await getDocs(tweetsQuery);
      // /* 개발 모드에서 react.js가 useEffect를 두 번 호출하기 때문에 콘솔에 트윗 하나 당 두 개가 뜰 것*/
      // // snapshot.docs.forEach((doc) => console.log(doc.data()));
      // /* 트윗을 불러왔으니 이 트윗을 state에 저장한다.
      // console.log를 반환하는 대신 트윗에서 ITweet을 만족하는 모든 데이터를 추출할 것이다. */
      // const tweets = snapshot.docs.map((doc) => {
      //   const { tweet, createdAt, userId, username, photo } = doc.data();
      //   return {
      //     tweet,
      //     createdAt,
      //     userId,
      //     username,
      //     photo,
      //     id: doc.id,
      //   };
      // });
      /* 위 코드 대신에 함수 사용 : 데이터베이스 및 쿼리와 실시간 연결 생성, 해당 쿼리에 새 요소가 생상되거나 요소가 삭제되었거나 또는 업데이트 됐을 때 쿼리에 알려줄 것임 */
      /* getDoc를 쓰는 대신에 onSnapshot 사용 */
      unsubscribe = await onSnapshot(tweetsQuery, (snapshot) => {
        const tweets = snapshot.docs.map((doc) => {
          const { tweet, createdAt, userId, username, photo } = doc.data();
          return {
            tweet,
            createdAt,
            userId,
            username,
            photo,
            id: doc.id,
          };
        });
        setTweet(tweets); //추출한 트윗들을 트윗 상태에 저장
      });
    };
    fetchTweets();
    return () => {
      unsubscribe && unsubscribe();
    };
  }, []);
  return (
    <Wrapper>
      {tweets.map((tweet) => (
        <Tweet key={tweet.id} {...tweet} />
      ))}
    </Wrapper>
  );
}

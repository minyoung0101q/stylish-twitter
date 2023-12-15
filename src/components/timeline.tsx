import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import { styled } from "styled-components";
import { db } from "../firebase";
import Tweet from "./tweet";

export interface ITweet {
  id: string;
  photo?: string /* photo는 필수값이 아니라고 설정 */;
  tweet: string;
  userId: string;
  username: string;
  createdAt: number;
}

const Wrapper = styled.div``;

export default function Timeline() {
  // React에 이건 트윗 배열이고, 기본값은 빈 배열이라고 알려줄 수 있음
  const [tweets, setTweet] = useState<ITweet[]>([]);
  const fetchTweets = async () => {
    const tweetsQuery = query(
      collection(db, "tweets"),
      orderBy("createdAt", "desc")
    );
    const snapshot = await getDocs(tweetsQuery);
    /* 개발 모드에서 react.js가 useEffect를 두 번 호출하기 때문에 콘솔에 트윗 하나 당 두 개가 뜰 것*/
    // snapshot.docs.forEach((doc) => console.log(doc.data()));
    /* 트윗을 불러왔으니 이 트윗을 state에 저장한다. 
    console.log를 반환하는 대신 트윗에서 ITweet을 만족하는 모든 데이터를 추출할 것이다. */
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
  };
  useEffect(() => {
    fetchTweets();
  }, []);
  return (
    <Wrapper>
      {tweets.map((tweet) => (
        <Tweet key={tweet.id} {...tweet} />
      ))}
    </Wrapper>
  );
}

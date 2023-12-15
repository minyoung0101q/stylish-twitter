import { styled } from "styled-components";
import PostTweetForm from "../components/post-tweet-form";
import Timeline from "../components/timeline";

// Wrapper의 display를 grid로 설정
const Wrapper = styled.div`
  display: grid;
  gap: 50px;
  overflow-y: scroll; // 트윗 작성 양식 : 그대로 고정되어 있는 상태에서, 트윗들을 스클로할 수 있게 하고 싶음
  grid-template-rows: 1fr 5fr;
`;

export default function Home() {
  return (
    <Wrapper>
      <PostTweetForm />
      <Timeline />
    </Wrapper>
  );
}

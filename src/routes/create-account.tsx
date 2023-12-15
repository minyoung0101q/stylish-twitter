import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useState } from "react";
import { auth } from "../firebase";
import { Link, useNavigate } from "react-router-dom";
import { FirebaseError } from "firebase/app";
import {
  Error,
  Form,
  Input,
  Switcher,
  Title,
  Wrapper,
} from "../components/auth-components";
import GithubButton from "../components/github-btn";

export default function CreateAccount() {
  const navigate = useNavigate();
  const [isLoading, setLoading] = useState(false);
  //받아온 name, email, password를 state에 저장
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  //state와 form을 만들었으면 on change listener를 만든다.
  //event를 가져온다 -> event의 type은 HTMLINPUT 개체의 React.ChangeEvent가 될 것이다.
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //event에서 target을 추출
    const {
      target: { name, value },
    } = e;
    if (name === "name") {
      setName(value);
    } else if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    }
  };
  //onSubmit 메서드는 form을 위한 것
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); //화면이 새로고침되지 않도록 설정해줌
    setError("");
    // isLoading이 참이면, 함수를 일찍 종료함
    if (isLoading || name === "" || email === "" || password === "") return;
    try {
      // 이제 여기 try 블록에서, await를 하고 email과 password를 이용해서 사용자를 생성해볼 것이당
      const credentials = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log(credentials.user); //사용자를 생성한 다음 바로 우리한테 정보를 돌려줌
      await updateProfile(credentials.user, {
        displayName: name,
      });
      navigate("/");
    } catch (e) {
      if (e instanceof FirebaseError) {
        setError(e.message);
      }
    } finally {
      setLoading(false);
    }

    console.log(name, email, password);
  };

  return (
    <Wrapper>
      <Title>Join 🔏</Title>
      <Form onSubmit={onSubmit}>
        <Input
          onChange={onChange}
          name="name"
          value={name}
          placeholder="Name"
          type="text"
          required
        />
        <Input
          onChange={onChange}
          name="email"
          value={email}
          placeholder="Email"
          type="email"
          required
        />
        <Input
          onChange={onChange}
          value={password}
          name="password"
          placeholder="Password"
          type="password"
          required
        />
        <Input
          type="submit"
          value={isLoading ? "Loading..." : "Create Account"}
        />
      </Form>
      {error !== "" ? <Error>{error}</Error> : null}
      <Switcher>
        Already have an account?
        <Link to="/login">log in &rarr;</Link>
      </Switcher>
      <GithubButton />
    </Wrapper>
  );
}

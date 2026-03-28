import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import * as S from "./Login.styled";
import ROUTE_LINK from "../../routes/RouterLink";
import { Nav, FormContainer, InputField } from "components";
import useAuthStore from "../../stores/useAuthStore";
import { AxiosError } from "axios";
import { toast } from "react-toastify";

interface FormValues {
  username: string;
  password: string;
  email: string;
}

const LoginPage = () => {
  const methods = useForm<FormValues>();
  const navigate = useNavigate();

  const login = useAuthStore((state) => state.login);

  const onSubmit = async (data: FormValues) => {
    try {
      await login(data.email, data.password);
      toast.success("✨Login successful!");
      navigate(ROUTE_LINK.LIST.path);
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        console.error("Axios error:", error.response?.data || error.message);
      } else {
        console.error("Unknown error:", error);
      }
    }
  };
  return (
    <>
      <Nav />
      <S.Container>
        <FormContainer onSubmit={onSubmit} methods={methods}>
          <S.Logo>
            <S.LogoImage src="/logo.png" alt="OreOre logo" />
            OreOre
          </S.Logo>
          <S.InputContainer>
            <InputField
              name="email"
              label="Email"
              placeholder="Enter your email."
            />
          </S.InputContainer>

          <S.InputContainer>
            <InputField
              name="password"
              label="Password"
              type="password"
              placeholder="Enter your password."
            />
          </S.InputContainer>
          <S.SubmitButton type="submit">Log In</S.SubmitButton>
          <S.Footer>
            <S.FooterLink onClick={() => navigate(ROUTE_LINK.SIGNUP.path)}>
              Sign Up
            </S.FooterLink>
          </S.Footer>
        </FormContainer>
      </S.Container>
    </>
  );
};

export default LoginPage;

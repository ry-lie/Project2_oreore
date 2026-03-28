import { useForm, SubmitHandler } from "react-hook-form";
import * as S from "./PasswordCheck.styled";
import { useNavigate } from "react-router-dom";
import ROUTE_LINK from "../../routes/RouterLink";
import { Nav, FormContainer, InputField } from "components";
import useAuthStore from "../../stores/useAuthStore";

interface FormValues {
  password: string;
}

export default function PasswordCheckPage() {
  const navigate = useNavigate();
  const methods = useForm<FormValues>();

  const checkPassword = useAuthStore((state) => state.checkPassword);

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    try {
      const isValid = await checkPassword(data.password);
      if (isValid) {
        navigate(ROUTE_LINK.INFO_EDIT.path);
      } else {
        alert("Incorrect password.");
      }
    } catch (error) {
      console.error("Password verification failed:", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <>
      <Nav />
      <S.Container>
        <FormContainer onSubmit={onSubmit} methods={methods}>
          <S.Title>Enter Password</S.Title>

          <S.InputContainer>
            <InputField name="password" label="Password" type="password" />
          </S.InputContainer>

          <S.SubmitButton type="submit">Verify</S.SubmitButton>
        </FormContainer>
      </S.Container>
    </>
  );
}

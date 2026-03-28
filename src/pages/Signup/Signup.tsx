import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import * as S from "./Signup.styled";
import { Nav, FormContainer, InputField } from "components";
import useAuthStore from "../../stores/useAuthStore";
import AddressSearch from "./AddressSearch/AddressSearch";
import {
  checkEmailAvailability,
  checkNicknameAvailability,
} from "../../utils/userValidation";
import { useNavigate } from "react-router-dom";
import ROUTE_LINK from "../../routes/RouterLink";
import { toast } from "react-toastify";

export interface FormValues {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
  nickname: string;
  phoneFirst: string;
  phoneSecond: string;
  postalCode: string;
  address: string;
  detailAddress: string;
}

export default function SignupPage() {
  const methods = useForm<FormValues>();
  const registerUser = useAuthStore((state) => state.register);

  const navigate = useNavigate();

  const {
    watch,
    setValue,
    clearErrors,
    formState: { errors },
  } = methods;

  const [emailValid, setEmailValid] = useState<boolean | null>(null);
  const [nicknameValid, setNicknameValid] = useState<boolean | null>(null);

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    const formattedPhone = `${data.phoneFirst}${data.phoneSecond}`;
    const payload = {
      email: data.email,
      password: data.password,
      name: data.name,
      nickname: data.nickname,
      phone: formattedPhone,
      postalCode: data.postalCode,
      basicAdd: data.address,
      detailAdd: data.detailAddress,
    };

    try {
      await registerUser(payload);
      toast.info("Signup completed successfully.");
      navigate(ROUTE_LINK.LOGIN.path);
    } catch (error: unknown) {
      console.error("Signup failed:", error);
      toast.error("Signup failed. Please try again.");
    }
  };

  const checkEmail = async () => {
    const email = watch("email");
    if (!email) {
      toast.warn("Please enter your email.");
      return;
    }

    const isAvailable = await checkEmailAvailability(email);
    setEmailValid(isAvailable);
  };

  const checkNickname = async () => {
    const nickname = watch("nickname");
    if (!nickname) {
      toast.warn("Please enter your nickname.");
      return;
    }

    const isAvailable = await checkNicknameAvailability(nickname);
    setNicknameValid(isAvailable);
  };

  return (
    <>
      <Nav />
      <S.Container>
        <FormContainer onSubmit={onSubmit} methods={methods}>
          <S.Title>Sign Up</S.Title>

          <S.InputContainer>
            <InputField
              name="email"
              label="Email"
              placeholder="Enter your email."
            />
            <S.CheckButton type="button" onClick={checkEmail}>
              Check
            </S.CheckButton>
          </S.InputContainer>
          {emailValid === true && (
            <S.HelperText>Email is available.</S.HelperText>
          )}
          {emailValid === false && (
            <S.HelperText style={{ color: "red" }}>
              This email is already in use.
            </S.HelperText>
          )}

          <S.InputContainer>
            <InputField
              name="password"
              label="Password"
              type="password"
              placeholder="Enter your password."
            />
          </S.InputContainer>
          <S.InputContainer>
            <InputField
              name="confirmPassword"
              label="Confirm Password"
              type="password"
              placeholder="Re-enter your password"
              rules={{
                validate: (value) =>
                  value === watch("password") ||
                  "Passwords do not match.",
              }}
              error={errors.confirmPassword?.message}
            />
          </S.InputContainer>

          <S.InputContainer>
            <InputField
              name="name"
              label="Name"
              placeholder="Enter your name"
            />
          </S.InputContainer>

          <S.InputContainer>
            <InputField
              name="nickname"
              label="Nickname"
              placeholder="Enter your nickname"
            />
            <S.CheckButton type="button" onClick={checkNickname}>
              Check
            </S.CheckButton>
          </S.InputContainer>
          {nicknameValid === true && (
            <S.HelperText>Nickname is available.</S.HelperText>
          )}
          {nicknameValid === false && (
            <S.HelperText style={{ color: "red" }}>
              This nickname is already in use.
            </S.HelperText>
          )}

          <S.InputContainer style={{ gap: "10px" }}>
            <InputField
              name="phoneFirst"
              label="Phone Number"
              placeholder="Area code"
            />
            <InputField name="phoneSecond" placeholder="Remaining digits" />
          </S.InputContainer>

          <div>
            <S.InputContainer style={{ marginBottom: "10px" }}>
              <InputField
                name="postalCode"
                label="Postal Code"
                placeholder="Enter postal code"
                readOnly
              />
              <AddressSearch setValue={setValue} clearErrors={clearErrors} />
            </S.InputContainer>
            <S.InputContainer style={{ flexDirection: "column", gap: "10px" }}>
              <InputField
                name="address"
                placeholder="Enter your address"
                readOnly
              />
              <InputField
                name="detailAddress"
                placeholder="Enter detailed address"
              />
            </S.InputContainer>
          </div>

          <S.SubmitButton type="submit">Sign Up</S.SubmitButton>
        </FormContainer>
      </S.Container>
    </>
  );
}

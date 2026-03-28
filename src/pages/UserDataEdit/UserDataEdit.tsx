import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import * as S from "./UserDataEdit.styled";
import { useNavigate } from "react-router-dom";
import ROUTE_LINK from "../../routes/RouterLink";
import { Label } from "../../components/InputField/InputFiled.styled";
import { Nav, FormContainer, InputField } from "components";
import useAuthStore from "../../stores/useAuthStore";
import AddressSearch from "./AddressSearch/AddressSearch";
import { toast } from "react-toastify";
import useHandleImageChange from "../../hooks/useHandleImageChange";

export interface FormValues {
  phoneFirst: string;
  phoneSecond: string;
  postalCode: string;
  address: string;
  detailAddress: string;
  profileImage?: File;
}

export default function UserDataEditPage() {
  const { user, updateUserProfile } = useAuthStore();
  const methods = useForm<FormValues>();
  const navigate = useNavigate();

  const { setValue, clearErrors } = methods;

  const [profileImage, setProfileImage] = useState<File | null>(null);
  const { imgInputRef, preview, hasFile, handleImageChange } =
    useHandleImageChange("profile");

  useEffect(() => {
    if (user) {
      const phoneFirst = user.phone?.slice(0, 3) || "";
      const phoneSecond = user.phone?.slice(3) || "";

      setValue("phoneFirst", phoneFirst);
      setValue("phoneSecond", phoneSecond);
      setValue("postalCode", user.postalCode || "");
      setValue("address", user.basicAdd || "");
      setValue("detailAddress", user.detailAdd || "");

      if (user.profileImage) {
        setProfileImage(user.profileImage as unknown as File);
      }
    }
  }, [user, setValue]);

  const onSubmit = async (data: FormValues) => {
    const formattedPhone = `${data.phoneFirst}${data.phoneSecond}`;
    const payload = {
      phone: formattedPhone,
      postalCode: data.postalCode,
      basicAdd: data.address,
      detailAdd: data.detailAddress,
      image: hasFile ? preview : "",
    };

    try {
      await updateUserProfile(payload);
      navigate(ROUTE_LINK.MYPAGE.path);
      toast.success("✨Profile updated successfully.");
    } catch (error) {
      console.error("Failed to update profile:", error);
      toast.error("An error occurred. Please try again.");
    }
  };

  const handleProfilePictureDelete = () => {
    setProfileImage(null);
    alert("Profile picture has been reset.");
  };

  return (
    <>
      <Nav />
      <S.Container>
        <FormContainer onSubmit={onSubmit} methods={methods}>
          <S.Title>Edit Profile</S.Title>

          <Label>Profile Picture</Label>
          <S.ProfilePicture>
            {profileImage ? (
              <S.ProfileImage
                src={hasFile ? preview : "/icons/profile.svg"}
                alt="Profile"
              />
            ) : (
              <S.ProfileImage
                src={hasFile ? preview : "/icons/profile.svg"}
                alt="Profile"
              />
            )}
          </S.ProfilePicture>
          <S.InputContainer>
            <S.FileInputLabel>
              Change Photo
              <S.FileInput
                type="file"
                accept="image/*"
                ref={imgInputRef}
                onChange={handleImageChange}
              />
            </S.FileInputLabel>
            <S.FileButton type="button" onClick={handleProfilePictureDelete}>
              Remove
            </S.FileButton>
          </S.InputContainer>

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

          <S.SubmitButton type="submit">Save Changes</S.SubmitButton>
        </FormContainer>
      </S.Container>
    </>
  );
}

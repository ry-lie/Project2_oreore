import axios from "axios";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";

import { Button, UserInput, Nav, ConfirmModal } from "components";

import useIsFocused from "../../hooks/useIsFocused";
import useInputValue from "../../hooks/UseUserInput";
import useHandleImageChange from "../../hooks/useHandleImageChange";
import { getAxios, postAxios, putAxios } from "../../utils/axios";
import useModalStore from "../../stores/modal/index";

import { S } from "./AddOrEditProduct.style";

interface CategoryProps {
  id: number;
  categoryName: string;
  value: string;
}

interface ItemInfoProps {
  _id: string;
  name: string;
  image: string;
  price: number;
  description: string;
  sellerId: {
    _id: string;
    nickname: string;
  };
  soldOut: boolean;
  categoryName: string;
  deletedAt: null;
  createdAt: string;
  updatedAt: string;
  __v: 0;
}

const AddOrEditProduct = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [categories, setCategories] = useState<[]>([]);

  const [selectedCategory, setSelectedCategory] = useState("");
  const [itemInfo, setItemInfo] = useState<ItemInfoProps | undefined>(
    undefined,
  );

  const [inputValue, handleInputChange] = useInputValue();
  const { isFocused, handleFocus, handleBlur } = useIsFocused();
  const { imgInputRef, preview, hasFile, handleImageChange } =
    useHandleImageChange("product");

  const { modalType, openModal, closeModal } = useModalStore();

  const productId = location.state;
  const getCategory = async () => {
    try {
      const res = await axios.get("/data/category.json");
      setCategories(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getCategory();
  }, []);

  const getOriginProductInfo = () => {
    getAxios(`/products/${productId}`).then((res) => setItemInfo(res.data));
  };

  useEffect(() => {
    if (location.pathname === "/editproduct") getOriginProductInfo();
  }, []);

  useEffect(() => {
    if (itemInfo) {
      handleInputChange("productName", itemInfo.name);
      handleInputChange("productPrice", itemInfo.price.toString());
      handleInputChange("productDescription", itemInfo.description);
      setSelectedCategory(itemInfo.categoryName);
    }
  }, [itemInfo]);

  const handleRadioValue = (e: React.MouseEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value;
    setSelectedCategory(value);
  };

  const postProducts = async () => {
    if (
      location.pathname === "/addproduct" &&
      inputValue.productName &&
      inputValue.productPrice &&
      inputValue.productDescription &&
      selectedCategory
    ) {
      try {
        const res = await postAxios("/products", {
          name: inputValue.productName,
          image: preview,
          price: Number(inputValue.productPrice),
          description: inputValue.productDescription,
          categoryName: selectedCategory,
        });

        if (res.status === 201) {
          toast.success("✨Product listed successfully!");
          navigate("/users/my");
        } else {
          toast.error("Failed to list the product. Please try again.");
        }
      } catch (error) {
        toast.error("An error occurred while listing the product.");
      }
    } else openModal("valid");
  };

  const putProduct = async () => {
    if (
      location.pathname === "/editproduct" &&
      inputValue.productName &&
      inputValue.productPrice &&
      inputValue.productDescription &&
      selectedCategory
    ) {
      try {
        const res = await putAxios(`/products/${location.state}`, {
          updateData: {
            name: inputValue.productName,
            image: preview,
            price: Number(inputValue.productPrice),
            description: inputValue.productDescription,
            categoryName: selectedCategory,
          },
        });

        if (res.status === 200) {
          toast.success("✨Product updated successfully.");
          navigate("/users/my");
        } else {
          toast.warn("Failed to update the product. Please try again.");
        }
      } catch (error) {
        toast.error("An error occurred while updating the product.");
      }
    } else openModal("valid");
  };

  const redirectToLogin = () => {
    navigate("/login");
    closeModal();
  };

  const handleImgInputClick = () => {
    if (imgInputRef.current) {
      imgInputRef.current.click();
    }
  };

  if (location.pathname === "editproduct" && !itemInfo) return null;
  if (!categories) return null;
  return (
    <S.AddOrEditProduct>
      {modalType === "valid" ? (
        <ConfirmModal
          modalText="Please fill in all required fields."
          onClick={closeModal}
        />
      ) : modalType === "login" ? (
        <ConfirmModal
          modalText="Please log in and try again."
          onClick={redirectToLogin}
        />
      ) : (
        ""
      )}
      <Nav />
      <S.TitleBox>Product Information</S.TitleBox>

      <S.UploadImgBox onClick={handleImgInputClick}>
        {hasFile ? (
          <>
            <S.UploadedImg src={preview} alt="미리보기" />
          </>
        ) : (
          <>
            <S.UploadIcon />
            <S.UploadText>Upload Image</S.UploadText>
            <S.Essential>Required</S.Essential>
          </>
        )}
        <S.ImgUpload
          type="file"
          accept="image/jpg, image/jpeg"
          multiple
          ref={imgInputRef}
          onChange={handleImageChange}
        />
      </S.UploadImgBox>
      {hasFile && <S.EditImgBtn>Change Photo</S.EditImgBtn>}
      <S.InfoTable hasFile={hasFile}>
        <S.GridTitle>
          Category<S.Essential>Required</S.Essential>
        </S.GridTitle>
        <S.GridContent>
          <S.CategoryWrap>
            {categories.map((category: CategoryProps) => {
              return (
                <label key={category.id}>
                  <S.CategoryBox
                    isSelected={selectedCategory === category.value}
                    selectedCategory={selectedCategory}
                  >
                    <S.Radio
                      type="radio"
                      name={category.categoryName}
                      value={category.value}
                      onClick={handleRadioValue}
                    />
                    {category.categoryName}
                  </S.CategoryBox>
                </label>
              );
            })}
          </S.CategoryWrap>
        </S.GridContent>

        <S.GridTitle>
          Product Name<S.Essential>Required</S.Essential>
        </S.GridTitle>
        <S.GridContent>
          <UserInput
            name="productName"
            type="text"
            width="234px"
            placeholder="Enter product name"
            value={inputValue.productName}
            onChange={(value) => handleInputChange("productName", value)}
          />
        </S.GridContent>

        <S.GridTitle>
          Price<S.Essential>Required</S.Essential>
        </S.GridTitle>
        <S.GridContent>
          <UserInput
            name="productPrice"
            type="text"
            width="234px"
            placeholder="Enter price"
            value={inputValue.productPrice}
            onChange={(value: string) => {
              if (/^\d*$/.test(value)) {
                handleInputChange("productPrice", value);
              } else {
                handleInputChange("productPrice", "");
                toast.warn("Please enter numbers only.");
              }
            }}
          />
        </S.GridContent>

        <S.GridTitle>
          Description<S.Essential>Required</S.Essential>
        </S.GridTitle>

        <S.GridContent>
          <S.ProductDescription
            isFocused={isFocused}
            onFocus={handleFocus}
            onBlur={handleBlur}
            value={inputValue.productDescription}
            onChange={(e) =>
              handleInputChange("productDescription", e.target.value)
            }
          ></S.ProductDescription>
        </S.GridContent>
      </S.InfoTable>
      {location.pathname === "/addproduct" ? (
        <Button
          btnText="List Product"
          bgcolor="orange70"
          onClick={postProducts}
        />
      ) : (
        <Button
          btnText="Update Product"
          bgcolor="orange70"
          onClick={putProduct}
        />
      )}
    </S.AddOrEditProduct>
  );
};

export default AddOrEditProduct;

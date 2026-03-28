import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { Nav, Button, ConfirmModal } from "components";

import { getAxios } from "../../utils/axios";
import formatPrice from "../../utils/formatPrice";

import { ItemProps } from "components/ItemCard/ItemCard";

import { S } from "./Detail.style";
import useModalStore from "../../stores/modal/index";
import { toast } from "react-toastify";
import useAuthStore from "../../stores/useAuthStore";
import ScrollUp from "../../components/ScrollUp/ScrollUp";
import scrollToTop from "../../utils/scrollToTop";

interface CartItemsProps {
  id: string;
  checked: boolean;
  sellerId: { _id: string; nickname: string };
}

const Detail = () => {
  const navigate = useNavigate();
  const { productId } = useParams<{ productId: string }>();
  const [item, setItem] = useState<ItemProps | null>(null);

  const sellerBoxRef = useRef<HTMLDivElement | null>(null);
  const [, setIsSellerBoxVisible] = useState(false);

  const { modalType, closeModal } = useModalStore();
  const user = useAuthStore();

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setIsSellerBoxVisible(entry.isIntersecting);
    });

    if (sellerBoxRef.current) {
      observer.observe(sellerBoxRef.current);
    }

    return () => {
      if (sellerBoxRef.current) {
        observer.unobserve(sellerBoxRef.current);
      }
    };
  }, []);

  useEffect(() => {
    getAxios(`/products/${productId}`).then((res) => setItem(res.data));
    closeModal();
  }, []);

  const addToCart = () => {
    const cartItems = localStorage.getItem("products")
      ? JSON.parse(localStorage.getItem("products")!)
      : [];

    const newItem = { id: productId, checked: false, shop: item?.sellerId };

    const check = cartItems.find(
      (item: CartItemsProps) => item.id === productId,
    );

    if (!check) {
      cartItems.push(newItem);
      localStorage.setItem("products", JSON.stringify(cartItems));
      toast.success("✨Item has been added to your cart.");
    } else toast.error("This item is already in your cart.");
  };

  const handleModalBtnClick = () => {
    closeModal();
    navigate("/cart");
  };

  const handleEditBtn = () => {
    const userId = user.user?.id;

    if (userId === item?.sellerId._id) {
      navigate("/editproduct", { state: productId });
    } else toast.warn("This item belongs to another seller.");
  };

  const purchase = () => {
    const newItem = { id: productId, checked: false, shop: item?.sellerId };

    navigate("/payment", { state: newItem });
  };

  const handleSellerInfoClick = () => {
    if (sellerBoxRef.current) {
      sellerBoxRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  if (!item) return null;
  return (
    <S.DetailWrap>
      {modalType === "addCartItem" && (
        <ConfirmModal
          width="140px"
          modalText="Item added to your cart. Go to cart?"
          onClick={handleModalBtnClick}
        />
      )}
      {modalType === "existCartItem" && (
        <ConfirmModal
          modalText="Already in your cart."
          onClick={closeModal}
        />
      )}
      <Nav />

      <S.Detail>
        <S.StickyWrap>
          <S.UpperWrap>
            <S.ProductImg imgUrl={item.image} />
            <S.ProductInfo>
              <div>
                {user.user?.id === item.sellerId._id && (
                  <S.EditBtn onClick={handleEditBtn} />
                )}

                <S.ProductName>{item.name}</S.ProductName>
                <S.ProductPrice>
                  $<S.Bold>{formatPrice(item.price)}</S.Bold>
                </S.ProductPrice>
                <S.InfoBox>
                  <S.SellerIcon />
                  <S.greyText>{item.sellerId.nickname}</S.greyText>
                </S.InfoBox>
                <S.InfoBox>
                  <S.DeliveryIcon />
                  <S.greyText>Free shipping</S.greyText>
                </S.InfoBox>
              </div>

              <S.BtnWrap>
                <Button
                  btnText="Add to Cart"
                  bgcolor="blue70"
                  onClick={addToCart}
                />
                <Button
                  btnText="Buy Now"
                  bgcolor="orange70"
                  onClick={purchase}
                />
              </S.BtnWrap>
            </S.ProductInfo>
          </S.UpperWrap>

          <S.NavBar>
            <S.NavCell>
              <S.NavText>Product Information</S.NavText>
            </S.NavCell>
            <S.NavCell>
              <S.NavText onClick={handleSellerInfoClick}>Seller Information</S.NavText>
            </S.NavCell>
          </S.NavBar>

          <S.LowerWrap>
            <S.Description>
              <S.Pre>{item.description}</S.Pre>
            </S.Description>
            <S.SellerBox ref={sellerBoxRef}>
              <S.SellerIcon />
              <S.greyText>{item.sellerId.nickname}</S.greyText>
              <ScrollUp onClick={scrollToTop} />
            </S.SellerBox>
          </S.LowerWrap>
        </S.StickyWrap>
      </S.Detail>
    </S.DetailWrap>
  );
};

export default Detail;

import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ROUTE_LINK from "../../routes/RouterLink";

import { Nav, Button, ItemCard, CartItem, ConfirmModal } from "components";

import { deleteAxios, getAxios } from "../../utils/axios";

import { CartItems } from "../../types/types";
import { ItemProps } from "../../components/ItemCard/ItemCard";

import { S } from "./MyPage.style";
import useModalStore from "../../stores/modal";

const MyPage = () => {
  const navigate = useNavigate();
  const [sellingItems, setSellingItems] = useState<ItemProps[]>([]);

  const [pageNum, setPageNum] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const limit = 6;

  const [purchasedItems, setPurchasedItems] = useState<CartItems[]>([]);
  const [filteredCartItems, setFilteredCartItems] = useState<
    {
      date: string;
      items: CartItems[];
    }[]
  >([]);
  const { modalType, openModal, closeModal } = useModalStore();

  let sellingurl = `products/my?currentPage=${currentPage}&limit=${limit}`;
  let purchasedurl = `orders?currentPage=${currentPage}&limit=${limit}`;

  useEffect(() => {
    getAxios(sellingurl).then((res) => {
      setSellingItems(res.data.myProducts);
      setTotalPage(res.data.totalPages);
    });
  }, []);
  useEffect(() => {
    getAxios(purchasedurl).then((res) => {
      setPurchasedItems(res.data.myProducts);
      setTotalPage(res.data.totalPages);
    });
  }, []);

  const editProfile = () => {
    navigate(ROUTE_LINK.PASSWORD_CHECK.path);
  };

  const addproduct = () => {
    navigate(ROUTE_LINK.ADD_PRODUCT.path);
  };

  const paginationNum = () => {
    let nums: number[] = [];
    for (let i = 1; i <= totalPage; i++) {
      nums.push(i);
    }

    setPageNum(nums);
  };

  const goToPrevPage = () => {
    if (currentPage !== 1) {
      setCurrentPage((prev) => prev - 1);
    } else return;
  };
  const goToNextPage = () => {
    if (currentPage < totalPage) {
      setCurrentPage((prev) => prev + 1);
    } else return;
  };

  const getSellingItems = () => {
    getAxios(sellingurl).then((res) => {
      setSellingItems(res.data.myProducts);
      setTotalPage(res.data.totalPages);
    });
  };
  useEffect(() => {
    getSellingItems();
  }, [currentPage]);

  useEffect(() => {
    paginationNum();
  }, [sellingItems]);

  const deleteProduct = (
    id: string,
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
  ) => {
    e.stopPropagation();
    e.preventDefault();
    deleteAxios(`/products/${id}`);
    openModal("deleteProduct");
  };

  const handleDeleteModalClick = () => {
    getSellingItems();
    closeModal();
  };

  useEffect(() => {
    let dates: string[] = [];

    const uniqueDates = [
      ...new Set(purchasedItems.map((item) => item.purchaseDate)),
    ];
    dates = uniqueDates;

    const groupedCartItems = dates.map((date) => ({
      date,
      items: purchasedItems.filter(
        (cartItem) => cartItem.purchaseDate === date,
      ),
    }));

    setFilteredCartItems(groupedCartItems);
  }, [purchasedItems]);

  if (!sellingItems || !sellingItems || !purchasedItems) return null;
  return (
    <S.MyPageWrap>
      {modalType === "deleteProduct" && (
        <ConfirmModal
          modalText="상품이 삭제되었습니다"
          onClick={handleDeleteModalClick}
        />
      )}
      <Nav />
      <S.MyPage>
        <S.SideProfile>
          <S.ProfileImg />
          <S.UserName>엘리스</S.UserName>
          <Button
            btnText="정보 수정하기"
            bgcolor="orange70"
            onClick={editProfile}
          />
          <Button
            btnText="상품 등록하기"
            bgcolor="orange70"
            onClick={addproduct}
          />
        </S.SideProfile>
        <S.MyPageContent>
          <S.SellingBox>
            <S.TitleBox>판매중인 상품</S.TitleBox>
            <S.ItemGrid>
              {sellingItems.map((sellingItem, idx) => {
                const column = 3;
                const row = Math.floor(idx / column) + 1;

                return (
                  <Link
                    to={`/products/${sellingItem._id}`}
                    key={sellingItem._id}
                  >
                    <ItemCard
                      {...sellingItem}
                      idx={idx}
                      row={row}
                      deleteProduct={deleteProduct}
                    />
                  </Link>
                );
              })}
            </S.ItemGrid>
            <S.PaginationBox>
              <S.ArrowIconBox>
                <S.LeftArrowIcon onClick={goToPrevPage} />
              </S.ArrowIconBox>
              {pageNum.map((num) => {
                return (
                  <S.PaginationNum
                    key={num}
                    num={num}
                    currentPage={currentPage}
                    onClick={() => setCurrentPage(num)}
                  >
                    {num}
                  </S.PaginationNum>
                );
              })}
              <S.ArrowIconBox>
                <S.RightArrowIcon onClick={goToNextPage} />
              </S.ArrowIconBox>
            </S.PaginationBox>
          </S.SellingBox>
          <S.PurchaseList>
            <S.TitleBox>구매 내역</S.TitleBox>
            {filteredCartItems.length > 0 ? (
              filteredCartItems.map(({ date, items }) => (
                <div key={date}>
                  <S.DateTitle>{date}</S.DateTitle> {/* 날짜 제목 표시 */}
                  {items.map((cartItem) => (
                    <S.CartGrid>
                      <Link to="/detail">
                        <CartItem
                          page="mypage"
                          imageSrc={cartItem.imageSrc}
                          title={cartItem.itemName}
                          description={`${cartItem.price.toLocaleString()} 원`}
                        />
                      </Link>

                      <S.Shop>
                        <S.ShopIconCircle>
                          <S.ShopIcon />
                        </S.ShopIconCircle>
                        {cartItem.shopName}
                      </S.Shop>
                    </S.CartGrid>
                  ))}
                </div>
              ))
            ) : (
              <S.EmptyCart>구매 내역이 없습니다.</S.EmptyCart>
            )}
          </S.PurchaseList>
        </S.MyPageContent>
      </S.MyPage>
    </S.MyPageWrap>
  );
};

export default MyPage;

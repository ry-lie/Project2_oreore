import * as S from "./Sidebar.styled";
import {
  FaCamera,
  FaMobileAlt,
  FaKeyboard,
  FaTv,
  FaMusic,
} from "react-icons/fa";

const categories = [
  { id: "camera", name: "Camera", icon: <FaCamera /> },
  { id: "phone", name: "Phone", icon: <FaMobileAlt /> },
  { id: "typewriter", name: "Typewriter", icon: <FaKeyboard /> },
  { id: "display", name: "Monitor", icon: <FaTv /> },
  { id: "audio", name: "Audio", icon: <FaMusic /> },
];

interface CategoryProps {
  selectedCategory: string | null;

  onClick: (value: string) => void;
}
const Sidebar = ({
  selectedCategory,

  onClick,
}: CategoryProps) => {
  return (
    <S.SidebarContainer>
      {categories.map((category) => (
        <S.CategoryButton
          key={category.id}
          isSelected={selectedCategory === category.id}
          onClick={() => onClick(category.id)}
        >
          {category.icon}
          <S.CategoryName>{category.name}</S.CategoryName>
        </S.CategoryButton>
      ))}
    </S.SidebarContainer>
  );
};

export default Sidebar;

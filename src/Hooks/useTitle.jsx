import { useEffect } from "react";

const useTitle = (title) => {
  useEffect(() => {
    document.title = `${title} | GreenBasket`;
  }, [title]);
};

export default useTitle;

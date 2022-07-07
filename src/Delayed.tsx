import React, { useState, useEffect } from "react";
import { LoadingOverlay } from "@mantine/core";

type Props = {
  children: React.ReactNode;
  waitBeforeShow?: number;
};

const Delayed = ({ children, waitBeforeShow = 500 }: Props) => {
  const [isShown, setIsShown] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsShown(true);
    }, waitBeforeShow);
    return () => clearTimeout(timer);
  }, [waitBeforeShow]);

  return isShown ? (
    children
  ) : (
    <LoadingOverlay visible={!isShown}></LoadingOverlay>
  );
};

export default Delayed;

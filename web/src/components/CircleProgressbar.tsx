import React from "react";
import {
  CircularProgress,
  CircularProgressLabel,
  Flex,
  ScaleFade,
} from "@chakra-ui/react";
import { useNuiEvent } from "../hooks/useNuiEvent";
import { debugData } from "../utils/debugData";
import { fetchNui } from "../utils/fetchNui";

interface Props {
  duration: number;
}

// debugData([
//   {
//     action: "circleProgress",
//     data: {
//       duration: 8000,
//     },
//   },
// ]);

const CircleProgressbar: React.FC = () => {
  const [visible, setVisible] = React.useState(false);
  const [progressDuration, setProgressDuration] = React.useState(0);
  const [value, setValue] = React.useState(0);
  const [cancelled, setCancelled] = React.useState(false);

  const progressComplete = () => {
    setVisible(false);
    fetchNui("progressComplete");
  };

  const progressCancel = () => {
    setCancelled(true);
    setValue(99); // Sets the final value to 100% kek
    setTimeout(() => {
      setVisible(false);
    }, 2500);
  };

  useNuiEvent("progressCancel", progressCancel);

  useNuiEvent<Props>("circleProgress", (data) => {
    if (visible) return;
    setCancelled(false);
    setVisible(true);
    setValue(0);
    setProgressDuration(data.duration);
    const onePercent = data.duration * 0.01;
    const updateProgress = setInterval(() => {
      setValue((previousValue) => {
        const newValue = previousValue + 1;
        newValue >= 100 && clearInterval(updateProgress);
        return newValue;
      });
    }, onePercent);
  });

  return (
    <Flex
      h="20%"
      w="100%"
      position="absolute"
      bottom="0"
      justifyContent="center"
      alignItems="center"
    >
      <ScaleFade in={visible} unmountOnExit>
        <CircularProgress
          value={value}
          size="7rem"
          onAnimationEnd={progressComplete}
          color={cancelled ? "rgb(198, 40, 40)" : "blue.300"}
          sx={
            !cancelled
              ? {
                  ".chakra-progress__indicator": {
                    transition: "none !important",
                    animation: "progress linear forwards !important",
                    animationDuration: `${progressDuration}ms !important`,
                    opacity: "1 !important",
                  },
                }
              : {
                  ".chakra-progress__indicator": {
                    transition: "none !important",
                    strokeDasharray: "264, 0 !important", // sets circle to full
                  },
                }
          }
        >
          <CircularProgressLabel color="black">{value}%</CircularProgressLabel>
        </CircularProgress>
      </ScaleFade>
    </Flex>
  );
};

export default CircleProgressbar;

import * as React from "react";
import { StyleProp, TextStyle, Text, ViewStyle, TouchableOpacity } from "react-native";
/**
 * ? Local Imports
 */
import styles, { _container } from "./MonthlyItem.style";
import { useGlobalState } from "../../component/GlobalHook";

export type CustomStyleProp =
  | StyleProp<ViewStyle>
  | Array<StyleProp<ViewStyle>>;

export type CustomTextStyleProp =
  | StyleProp<TextStyle>
  | Array<StyleProp<TextStyle>>;

export interface IMonthlyItemProps {
  index?: number;
  isToday?: boolean;
  isActive?: boolean;
  activeBackgroundColor?: string;
  inactiveBackgroundColor?: string;
  todayTextStyle?: CustomTextStyleProp;
  itemContainerStyle?: CustomStyleProp;
  onPress?: () => void;
}

const MonthlyItem: React.FC<IMonthlyItemProps> = ({
  index,
  todayTextStyle,
  itemContainerStyle,
  isActive = false,
  isToday = false,
  activeBackgroundColor = "#49c1c2",
  inactiveBackgroundColor = "#f0f0f0",
}) => {
  const [dayChoose, setDayChoose] = useGlobalState<any>('dayChoose');
  return (
    <TouchableOpacity
      style={[
        _container(
          isActive ? activeBackgroundColor : inactiveBackgroundColor,
          isToday,
        ),
        itemContainerStyle,
      ]}
      onPress={() => setDayChoose(index)}
    >
      {isToday && (
        <Text style={[styles.todayTextStyle, todayTextStyle]}>{index}</Text>
      )}
      {!isToday && (
        <Text style={[styles.todayTextStyle, todayTextStyle]}>{index}</Text>
      )}
    </TouchableOpacity>
  );
};

export default MonthlyItem;

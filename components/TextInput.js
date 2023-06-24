import { TextInput as RNTextInput } from 'react-native';
import View from './View';
import Icon from './Icon';
import Button from './Button';

export default function TextInput ({
  leftIconName,
  rightIcon,
  handlePasswordVisibility,
  ...otherProps
}) {
  return (
    <View className="bg-slate-100 rounded flex-row p-3 my-3 w-full border-slate-500">
      {
        leftIconName 
        ? (<Icon
            name={leftIconName}
            size={22}
            color={'#64748b'}
            style={{ marginRight: 10 }}
          />)
        : null
      }
      <RNTextInput
        style={{
          flex: 1,
          width: '100%',
          fontSize: 18,
          color: "#000000"
        }}
        placeholderTextColor={"#a8a29e"}
        {...otherProps}
      />
      {
        rightIcon
        ? (<Button onPress={handlePasswordVisibility}>
            <Icon
              name={rightIcon}
              size={22}
              color={"#a8a29e"}
              style={{ marginRight: 10 }}
            />
          </Button>)
        : <></>
      }
    </View>
  );
};

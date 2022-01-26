import { CheckBox } from 'grommet';

export interface SwitchProps {
  checked: boolean;
  onChange: Function;
}

export const Switch:React.FC<SwitchProps> = ({checked, onChange}) => {
  return (
    <CheckBox
      toggle
      checked={checked}
      onChange={() => onChange()}
    />
  )
};

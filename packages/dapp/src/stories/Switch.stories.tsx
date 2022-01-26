import type { Meta, Story } from '@storybook/react';
import type { SwitchProps } from '../components/Switch';
import { Switch } from '../components/Switch';

export default {
  title: 'Components/Switch',
  component: Switch,
} as Meta;

const Template: Story<SwitchProps> = args => 
  <Switch {...args} />
;

export const SwitchOn = Template.bind({});
SwitchOn.args = {
  checked: true,
  onChange: () => {}
};

export const SwitchOff = Template.bind({});
SwitchOff.args = {
  checked: false,
  onChange: () => {}
};

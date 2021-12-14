import styled from 'styled-components';
import { colors, fonts } from '../../styles';

export const Button = styled.button`
  padding: 8px;
  border-radius: 4px;
  font-size: ${fonts.size.small};
  font-weight: ${fonts.weight.medium};
  color: rgb(${colors.dark});
  cursor: pointer;
`;

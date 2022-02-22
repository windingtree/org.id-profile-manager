import type { TextProps } from 'grommet';
import { Nav, Anchor } from 'grommet';
import { useNavigate } from 'react-router-dom';
import { FormPrevious } from 'grommet-icons';

export interface Breadcrumb {
  path: string;
  label: string;
}

export interface BreadcrumbsProps {
  breadcrumbs?: Breadcrumb[];
  size?: TextProps['size'];
}

export const Breadcrumbs = ({ breadcrumbs, size }: BreadcrumbsProps) =>{
  const navigate = useNavigate();

  if (breadcrumbs === undefined || breadcrumbs.length === 0) {
    return null;
  }

  return (
    <Nav
      direction='row'
      align='center'
      margin={{
        bottom: size
      }}
    >
      {breadcrumbs.map(
        ({ path, label }, i) => (
          <Anchor
            key={i}
            label={label}
            onClick={() => navigate(path)}
            icon={<FormPrevious/>}
            gap='xsmall'
          />
        )
      )}
    </Nav>
  );
};

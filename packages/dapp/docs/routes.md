# The Dapp routes configuration and utilities

## Routes configuration

The Dapp routes configuration is in the file `./src/components/Routes.tsx`

```typescript
// Pages
import { Home } from '../pages/Home';
import { Keys } from '../pages/Keys';

export const pagesConfig: PageConfig[] = [
  {
    path: '/',
    element: <Home />,
    title: 'Home', // <-- Page title in the header
    label: 'Home' // <-- Menu label
  },
  {
    path: '/keys',
    element: <Keys />,
    title: 'Keys management',
    label: 'Keys'
  }
];
```

## `AppRoutes` component

Special component that builds routes element. This component is used on the `App.tsx` as a part of main layout.

```typescript
<AppRoutes />
```

## `GlobalMenu` component

Create a menu with links to all registered pages. This component is used in the header.

```typescript
<GlobalMenu />
```

## `usePageTitle` hook

Allows to get a page title for the currently loaded route. In the case of reoute that not registered this hook returns '404' (string). This hook is used in the header.

## `Protected` component

To create protected routes should be used `<Protected component={<Component />} path='/navigate/to' />`

> `path` is defaults to `/`

Here is an example of protected route config:

```typescript
{
  path: '/keys',
  element: <Protected component={<Keys />} />,
  title: 'Keys management',
  label: 'Keys'
}
```

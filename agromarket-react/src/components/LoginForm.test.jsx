import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { expect, test } from 'vitest';
import LoginForm from './LoginForm.jsx';

test('renders the login form', () => {
  const markup = renderToStaticMarkup(
    createElement(LoginForm, { onLogin: () => {} })
  );

  expect(markup).toContain('class="login-form"');
  expect(markup).toContain('placeholder="Email"');
  expect(markup).toContain('name="password"');
  expect(markup).toContain('Войти');
});

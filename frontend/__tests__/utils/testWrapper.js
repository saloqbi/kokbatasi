import React from 'react';

export function createWrapper(Provider) {
  return ({ children }) => <Provider>{children}</Provider>;
}

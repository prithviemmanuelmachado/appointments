import React from 'react';
import { render, screen } from '@testing-library/react';
import ErrorBoundary from './index';

const ProblematicComponent = () => {
  throw new Error('Test error');
};

describe('ErrorBoundary Component', () => {
  it('renders children when there is no error', () => {
    render(
      <ErrorBoundary>
        <div>Safe Component</div>
      </ErrorBoundary>
    );
    expect(screen.getByText('Safe Component')).toBeInTheDocument();
  });

  it('renders the fallback UI when an error occurs', () => {
    render(
      <ErrorBoundary>
        <ProblematicComponent />
      </ErrorBoundary>
    );
    expect(
      screen.getByText('Something went wrong. Please try again later.')
    ).toBeInTheDocument();
    expect(screen.getByText(/Test error/i)).toBeInTheDocument();
  });
});

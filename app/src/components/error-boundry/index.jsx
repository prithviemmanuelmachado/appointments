import React from 'react';
import {
    ErrorTitle,
    ErrorContainer,
    Container
} from './index.style';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        // Update state to show fallback UI
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        // Log the error details
        console.error('Error Boundary Caught an Error:', error, errorInfo);
        this.setState({ error, errorInfo });
    }

    render() {
        if (this.state.hasError) {
            // Fallback UI
            return (
            <Container>
                <ErrorContainer>
                <ErrorTitle>Something went wrong. Please try again later.</ErrorTitle>
                <details style={{ whiteSpace: 'pre-wrap' }}>
                    {this.state.error && this.state.error.toString()}
                    <br />
                    {this.state.errorInfo?.componentStack}
                </details>
                </ErrorContainer>
            </Container>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
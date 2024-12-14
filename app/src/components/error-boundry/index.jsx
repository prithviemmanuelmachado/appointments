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

    handleReset = () => {
        const { navigate } = this.props;
        if (navigate) {
            navigate('/', { replace: true });
        }
        this.setState({ hasError: false });
    };

    render() {
        if (this.state.hasError) {
            // Fallback UI
            return (
            <Container>
                <ErrorContainer>
                <ErrorTitle>Something went wrong. Please contact site administrator or try again later.</ErrorTitle>
                <button onClick={this.handleReset} style={{ padding: "10px 20px" }}>
                    Go Home
                </button>
                <details style={{ whiteSpace: 'pre-wrap' }}>
                    {this.state.error && this.state.error.toString()}
                    <br />
                </details>
                </ErrorContainer>
            </Container>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
import React from "react";

const ErrorComponent = ({ error }: { error: string }) => {
    return (
        <div>
            <p>An error occured: {error}</p>
        </div>
    );
};

export default ErrorComponent;
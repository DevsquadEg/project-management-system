const SubmitBtn = ({
    isSubmitting,
    title,
    className,
}: {
    isSubmitting: boolean;
    title: string;
    className?: string;
}) => {
    return (
        <button
            type="submit"
            className={`btn custom-btn btn-lg ${className}`}
            disabled={isSubmitting}
        >
            {(isSubmitting && (
                <span
                    className="spinner-border spinner-border-sm"
                    role="status"
                    aria-hidden="true"
                ></span>
            )) ||
                title}
        </button>
    );
};

export default SubmitBtn;
